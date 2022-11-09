import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { USERID, WALLETID } from 'src/core/constants';
import { Paystack } from '../../core/utils/Paystack';
import { Wallet } from '../transaction/interfaces/wallet.interface';
import { User } from '../user/interfaces/user.interface';
import { Account } from './interfaces/account.interface';

@Injectable()
export class AccountService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  /**
   * Get banks details and related code
   * @returns
   */
  async getBanks() {
    return await Paystack.getBanks();
  }

  async addAccountToWallet(
    accountNumber: string,
    bankCode: string,
    userId: number,
  ) {
    const user = await this.knex<User>('users').where({ id: userId }).first();
    const wallet = await this.knex<Wallet>('wallets')
      .where({ userId: userId })
      .first();
    const response = await Paystack.resolveAccountNumber(
      accountNumber,
      bankCode,
    );

    if (response.status) {
      await this.knex<Account>('accounts').insert({
        accountName: response.data.account_name,
        accountNumber: accountNumber,
        bankCode: bankCode,
        userId: user.id,
        walletId: wallet.id,
      });
    }

    return response;
  }

  async getAccounts(id: number, idType: string) {
    switch (idType) {
      case USERID:
        return await this.knex<Account>('accounts').where({ userId: id });
      case WALLETID:
        return await this.knex<Account>('accounts').where({ walletId: id });
      default:
        return null;
    }
  }
}
