import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ACCOUNT_SERVICE, USERID } from 'src/core/constants';
import { AccountService } from './account.service';
import { AddAccountDto } from './dto/account.dto';

@Controller('accounts')
export class AccountController {
  constructor(
    @Inject(ACCOUNT_SERVICE) private readonly accountService: AccountService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('banks')
  async getBanks() {
    return this.accountService.getBanks();
  }

  @HttpCode(HttpStatus.OK)
  @Post('add')
  async addAccount(@Body() body: AddAccountDto) {
    return this.accountService.addAccountToWallet(
      body.account_number,
      body.bank_code,
      body.userId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('wallet/:userId')
  async getWallet(@Param('userId') userId: number) {
    return this.accountService.getWallet(userId, USERID);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':userId')
  async getAccountsByUserId(@Param('userId') userId: number) {
    return this.accountService.getAccounts(userId, USERID);
  }
}
