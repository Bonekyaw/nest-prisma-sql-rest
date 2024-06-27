import {
  Controller,
  // Get,
  Post,
  Body,
  UseGuards,
  // HttpCode,
  // HttpStatus,
  // Request,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { User } from './decorators/user.decorator';

import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { ConfirmDto } from './dto/confirm.dto';

/*
 * POST localhost:8080/api/v1/auth/register
 * Register an admin using Phone & password only
 * In real world, OTP should be used to verify phone number
 * But in this app, we will simulate fake OTP - 123456
 */

@Throttle({
  short: { ttl: 60000, limit: 3 },
  long: { limit: 30, ttl: 60000 * 60 * 24 },
})
@Public()
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }

  @Post('confirm')
  async confirm(@Body() confirmDto: ConfirmDto) {
    return this.authService.confirm(confirmDto);
  }
}
