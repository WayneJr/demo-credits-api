import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class DepositFundsDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  transactionPin: string;
}

export class WithdrawFundsDto {
  @IsString()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  accountId: number;

  @IsNumberString()
  @IsNotEmpty()
  transactionPin: string;
}

export class TransferToWalletDto {
  @IsString()
  @IsNotEmpty()
  receiverTag: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumberString()
  @IsNotEmpty()
  transactionPin: string;
}
