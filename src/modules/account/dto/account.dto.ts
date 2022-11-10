import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddAccountDto {
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @IsString()
  @IsNotEmpty()
  bank_code: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
