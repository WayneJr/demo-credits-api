import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsNumberString()
  @IsNotEmpty()
  transactionPin: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
