import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { USERID, WALLETID } from '../../core/constants';
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
    account_number: string,
    bank_code: string,
    userId: number,
  ) {
    const user = await this.knex<User>('users').where({ id: userId }).first();
    const wallet = await this.knex<Wallet>('wallets')
      .where({ user_id: userId })
      .first();
    const response = await Paystack.resolveaccount_number(
      account_number,
      bank_code,
    );

    if (response.status) {
      await this.knex<Account>('accounts').insert({
        account_name: response.data.account_name,
        account_number: account_number,
        bank_code: bank_code,
        user_id: user.id,
        wallet_id: wallet.id,
      });
    }

    return response;
  }

  async getWallet(id: number, idType: string) {
    let wallets = [];
    switch (idType) {
      case USERID:
        wallets = await this.knex<Wallet>('wallets').where({
          user_id: id,
        });

        return wallets[0];
      case WALLETID:
        wallets = await this.knex<Wallet>('wallets').where({ id: id });
      default:
        return null;
    }
  }

  async getAccounts(id: number, idType: string) {
    switch (idType) {
      case USERID:
        return await this.knex<Account>('accounts').where({ user_id: id });
      case WALLETID:
        return await this.knex<Account>('accounts').where({ wallet_id: id });
      default:
        return null;
    }
  }
}
