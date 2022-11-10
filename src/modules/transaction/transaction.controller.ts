import {
  Request,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Param,
} from '@nestjs/common';
import { TRANSACTION_SERVICE } from '../../core/constants';
import { WebhookPayload } from '../../core/utils/interfaces/paystack.interface';
import { DepositFundsDto, WithdrawFundsDto } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('deposit')
  async depositFunds(@Body() body: DepositFundsDto) {
    return this.transactionService.depositFunds({
      amount: body.amount,
      email: body.email,
      transactionPin: body.transactionPin,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify/deposit')
  async verifyTransaction(
    @Request() req: Request,
    @Body() body: WebhookPayload,
  ) {
    return this.transactionService.verifyDepositOrWithdrawal({
      body,
      headers: req.headers,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('transfer/:userId')
  async transferToWallet(
    @Param('userId') userId: number,
    @Body() body: { amount: number; receiverTag: string },
  ) {
    return this.transactionService.transferToWallet(
      userId,
      body.receiverTag,
      body.amount,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('withdraw')
  async withdrawFunds(@Body() body: WithdrawFundsDto) {
    return this.transactionService.initiateWithdrawal(
      body.userId,
      body.amount,
      body.accountId,
    );
  }
}
