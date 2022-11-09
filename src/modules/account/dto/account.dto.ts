import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddAccountDto {
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
