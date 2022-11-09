import {
  Request,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { TRANSACTION_SERVICE } from 'src/core/constants';
import { WebhookPayload } from 'src/core/utils/interfaces/paystack.interface';
import { DepositFundsDto } from './dto/transaction.dto';
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
  async verifyTransaction(@Request() req, @Body() body: WebhookPayload) {
    return this.transactionService.verifyDeposit({
      body,
      headers: req.headers,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('banks')
  async getBanks() {
    return this.transactionService.getBanks();
  }
}
