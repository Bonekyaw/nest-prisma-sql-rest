import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 12)
  @Matches(/^[0-9]+$/, {
    message: 'Invalid phone number.',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^[0-9]+$/, {
    message: 'Invalid OTP.',
  })
  otp: string;
}
