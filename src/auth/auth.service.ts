import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Admin } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

import { DatabaseService } from '../database/database.service';
import { AdminsService } from '../admins/admins.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { Status } from '../admins/constants/status.enum';

const rand = () => Math.random().toString(36).substring(2);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  // *** Local Strategy for Passport Auth ***

  async validateUser(phone: string, pass: string): Promise<any> {
    if (!/^[0-9]+$/.test(phone) || phone.length < 8 || phone.length > 12) {
      throw new BadRequestException('Invalid Phone Number!');
    }
    if (!/^[0-9]+$/.test(pass) || pass.length != 8) {
      throw new BadRequestException('Invalid Password!');
    }

    const admin = await this.adminsService.findByPhone(phone);
    if (!admin) {
      throw new NotFoundException('This phone number has not registered yet!');
    }

    // Wrong Password allowed 3 times per day
    if (admin.status === 'freeze') {
      throw new ForbiddenException(
        'Your account is temporarily locked. Please contact us.',
      );
    }

    let result;

    const isEqual = await bcrypt.compare(pass, admin.password);
    if (!isEqual) {
      // ----- Starting to record wrong times --------
      const lastRequest = new Date(admin.updatedAt).toLocaleDateString();
      const isSameDate = lastRequest == new Date().toLocaleDateString();

      if (!isSameDate) {
        const adminData = {
          error: 1,
        };
        result = await this.adminsService.update(admin.id, adminData);
      } else {
        if (admin.error >= 2) {
          const adminData = {
            status: Status.Freeze,
          };
          result = await this.adminsService.update(admin.id, adminData);
        } else {
          const adminData = {
            error: {
              increment: 1,
            },
          };
          result = await this.adminsService.update(admin.id, adminData);
        }
      }
      // ----- Ending -----------
      throw new UnauthorizedException('Password is wrong.');
    }

    const randToken = rand() + rand() + rand();
    if (admin.error >= 1) {
      const adminData = {
        error: 0,
        randToken: randToken,
      };
      result = await this.adminsService.update(admin.id, adminData);
    } else {
      const adminData = {
        randToken: randToken,
      };
      result = await this.adminsService.update(admin.id, adminData);
    }

    return result;
  }

  // *** Login with phone & password ***

  async login(user: Admin) {
    const payload = { sub: user.id };
    const jwtToken = this.jwtService.sign(payload);
    return {
      message: 'Successfully Logged In.',
      token: jwtToken,
      user_id: user.id,
      randomToken: user.randToken,
    };
  }

  // *** Register with phone - In order to request OTP ***

  async register(registerDto: RegisterDto) {
    const phone = registerDto.phone;
    const admin = await this.adminsService.findByPhone(phone);
    if (admin) {
      throw new BadRequestException('This phone number already exists');
    }
    // OTP processing eg. Sending OTP request to Operator
    const otpCheck = await this.prisma.otp.findUnique({
      where: { phone: phone },
    });
    const token = rand() + rand();
    let result;
    const otp = '123456';

    if (!otpCheck) {
      const otpData = {
        phone, // phone
        otp, // fake OTP
        rememberToken: token,
        count: 1,
      };

      result = await this.prisma.otp.create({ data: otpData });
    } else {
      const lastRequest = new Date(otpCheck.updatedAt).toLocaleDateString();
      const isSameDate = lastRequest == new Date().toLocaleDateString();

      if (isSameDate && otpCheck.error === 5) {
        throw new ForbiddenException(
          'OTP is wrong 5 times today. Try again tomorrow.',
        );
      }

      if (!isSameDate) {
        const otpData = {
          otp,
          rememberToken: token,
          count: 1,
          error: 0,
        };
        result = await this.prisma.otp.update({
          where: { id: otpCheck.id },
          data: otpData,
        });
      } else {
        if (otpCheck.count === 3) {
          throw new ForbiddenException(
            'OTP requests are allowed only 3 times per day. Please try again tomorrow,if you reach the limit.',
          );
        } else {
          const otpData = {
            otp,
            rememberToken: token,
            count: {
              increment: 1,
            },
          };
          result = await this.prisma.otp.update({
            where: { id: otpCheck.id },
            data: otpData,
          });
        }
      }
    }

    return {
      message: `We are sending OTP to 09${result.phone}.`,
      phone: result.phone,
      token: result.rememberToken,
    };
  }

  // ***  Verify with phone, token & OTP - In order to go to password confirmation api  ***

  async verify(verifyDto: VerifyDto) {
    const { phone, token, otp } = verifyDto;

    const admin = await this.adminsService.findByPhone(phone);
    if (admin) {
      throw new BadRequestException('This phone number already exists');
    }

    const otpCheck = await this.prisma.otp.findUnique({
      where: { phone: phone },
    });
    if (!otpCheck) {
      throw new NotFoundException(`OTP was not sent to ${phone}!`);
    }

    // Wrong OTP allowed 5 times per day
    const lastRequest = new Date(otpCheck!.updatedAt).toLocaleDateString();
    const isSameDate = lastRequest == new Date().toLocaleDateString();
    if (isSameDate && otpCheck.error === 5) {
      throw new ForbiddenException(
        'OTP is wrong 5 times today. Try again tomorrow.',
      );
    }

    let result;

    if (otpCheck.rememberToken !== token) {
      const otpData = {
        error: 5,
      };
      result = await this.prisma.otp.update({
        where: { id: otpCheck.id },
        data: otpData,
      });
      throw new BadRequestException('Token is invalid.');
    }

    const updatedAtMoment = moment(otpCheck.updatedAt);
    const currentMoment = moment();
    const difference = currentMoment.diff(updatedAtMoment);
    // console.log('Moment Diff:', difference);

    // const difference = moment() - moment(otpCheck!.updatedAt);

    if (difference > 90000) {
      // expire at 1 min 30 sec
      throw new BadRequestException('OTP is expired.');
    }

    if (otpCheck.otp !== otp) {
      // ----- Starting to record wrong times --------
      if (!isSameDate) {
        const otpData = {
          error: 1,
        };
        result = await this.prisma.otp.update({
          where: { id: otpCheck.id },
          data: otpData,
        });
      } else {
        const otpData = {
          error: {
            increment: 1,
          },
        };
        result = await this.prisma.otp.update({
          where: { id: otpCheck.id },
          data: otpData,
        });
      }
      // ----- Ending -----------
      throw new BadRequestException('OTP is incorrect.');
    }

    const randomToken = rand() + rand() + rand();
    const otpData = {
      verifyToken: randomToken,
      count: 1,
      error: 1,
    };
    result = await this.prisma.otp.update({
      where: { id: otpCheck.id },
      data: otpData,
    });

    return {
      message: 'Successfully OTP is verified',
      phone: result.phone,
      token: result.verifyToken,
    };
  }

  // ***  Confirm with phone, token & password - In order to create a new admin user  ***

  async confirm(confirmDto: ConfirmDto) {
    const { phone, token, password } = confirmDto;

    const admin = await this.adminsService.findByPhone(phone);
    if (admin) {
      throw new BadRequestException('This phone number already exists');
    }

    const otpCheck = await this.prisma.otp.findUnique({
      where: { phone: phone },
    });
    if (!otpCheck) {
      throw new NotFoundException(`OTP was not sent to ${phone}!`);
    }

    if (otpCheck.error === 5) {
      throw new BadRequestException(
        'This request may be an attack. If not, try again tomorrow.',
      );
    }

    let result;

    if (otpCheck.verifyToken !== token) {
      const otpData = {
        error: 5,
      };
      result = await this.prisma.otp.update({
        where: { id: otpCheck.id },
        data: otpData,
      });

      throw new BadRequestException(
        `Token is invalid. This ${result.phone} is blocked.`,
      );
    }

    const updatedAtMoment = moment(otpCheck.updatedAt);
    const currentMoment = moment();
    const difference = currentMoment.diff(updatedAtMoment);
    // console.log("Diff", difference);

    if (difference > 300000) {
      // will expire after 5 min
      throw new ForbiddenException(
        'Your request is expired. Please try again.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const randToken = rand() + rand() + rand();

    const adminData = {
      phone: phone,
      password: hashPassword,
      status: Status.Active,
      randToken: randToken,
    };
    const newAdmin = await this.adminsService.create(adminData);

    // jwt token
    const payload = { sub: newAdmin.id };
    const jwtToken = this.jwtService.sign(payload);

    return {
      message: 'Successfully created an account.',
      token: jwtToken,
      user_id: newAdmin.id,
      randomToken: randToken,
    };
  }
}
