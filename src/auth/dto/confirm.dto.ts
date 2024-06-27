import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ConfirmDto {
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
  @Length(8, 8)
  @Matches(/^[0-9]+$/, {
    message: 'Invalid Password.',
  })
  password: string;
}
