import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import {
  DEPOSIT,
  CREDIT,
  PROCESSING,
  PAYSTACK_CURRENCY,
  SUCCESS,
} from 'src/core/constants';
import { WebhookPayload } from 'src/core/utils/interfaces/paystack.interface';
import { Paystack } from 'src/core/utils/Paystack';
import { User } from '../user/interfaces/user.interface';
import { Wallet } from './interfaces/wallet.interface';
import { Transaction } from './interfaces/transaction.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private config: ConfigService,
  ) {}

  async depositFunds({
    amount,
    email,
    transactionPin,
  }: {
    amount: number;
    email: string;
    transactionPin: string;
  }) {
    const user = await this.knex<User>('users').where({ email }).first();
    const wallet = await this.knex('wallets')
      .where({ user_id: user.id })
      .first();

    if (user.transactionPin !== transactionPin) {
      throw new ForbiddenException('Invalid transaction pin');
    }
    const response = await Paystack.initializeTransaction({
      amount,
      email: user.email,
    });

    await this.knex<Transaction>('transactions').insert({
      amount,
      mode: DEPOSIT,
      type: CREDIT,
      status: PROCESSING,
      currency: PAYSTACK_CURRENCY,
      reference: response.data.reference,
      user_id: user.id,
      wallet_id: wallet.id,
    });

    return {
      ...response,
    };
  }

  async verifyDeposit({
    body,
    headers,
  }: {
    body: WebhookPayload;
    headers: Request['headers'];
  }) {
    const hash = crypto
      .createHmac('sha512', this.config.get('PAYSTACK_SECRET'))
      .update(JSON.stringify(body))
      .digest('hex');
    if (hash == headers['x-paystack-signature']) {
      // Retrieve the request's body
      const event = body;
      // Do something with event
      if (event.event === 'charge.success') {
        // verify transaction and update wallet
        const session = await this.knex.transaction();
        session<Transaction>('transactions')
          .where({ reference: event.data.reference })
          .update({ status: SUCCESS })
          .then(async () => {
            const transaction = await this.knex<Transaction>('transactions')
              .select('*')
              .where({ reference: event.data.reference })
              .first();
            const wallet = await this.knex<Wallet>('wallets')
              .select('*')
              .where({
                id: transaction.wallet_id,
              })
              .first();
            await session<Wallet>('wallets')
              .where('id', wallet.id)
              .increment('currentBalance', event.data.amount);
            return null;
          })
          .then(session.commit)
          .catch((err) => {
            console.log(err);
            return session.rollback;
          });
      }
    }
  }

  async getBanks() {
    return await Paystack.getBanks();
  }
}
