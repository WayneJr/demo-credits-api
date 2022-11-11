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
  DEBIT,
  WALLET,
} from '../../core/constants';
import { WebhookPayload } from '../../core/utils/interfaces/paystack.interface';
import { Paystack } from '../../core/utils/Paystack';
import { User } from '../user/interfaces/user.interface';
import { Wallet } from './interfaces/wallet.interface';
import { Transaction } from './interfaces/transaction.interface';
import { Account } from '../account/interfaces/account.interface';
import { v4 as uuidv4 } from 'uuid';

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
      amount: amount / 100,
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

  async verifyDepositOrWithdrawal({
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
              .increment('currentBalance', event.data.amount / 100);
            return null;
          })
          .then(session.commit)
          .catch((err) => {
            console.log(err);
            return session.rollback;
          });
      } else if (event.event === 'transfer.success') {
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
              .decrement('currentBalance', event.data.amount / 100);
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

  async transferToWallet(
    userId: number,
    receiverTag: string,
    amount: number,
    transactionPin: string,
  ) {
    const user = await this.knex<User>('users').where({ id: userId }).first();

    if (user.transactionPin !== transactionPin) {
      throw new ForbiddenException('Invalid transaction pin');
    }
    const senderWallet = await this.knex<Wallet>('wallets')
      .where({ user_id: userId })
      .first();

    if (senderWallet.currentBalance < amount) {
      throw new ForbiddenException('Insufficient funds');
    }

    const receiverWallet = await this.knex<Wallet>('wallets')
      .where({ tag: receiverTag })
      .first();

    const senderTransaction = await this.knex<Transaction>(
      'transactions',
    ).insert({
      amount: amount,
      mode: WALLET,
      type: DEBIT,
      status: PROCESSING,
      currency: PAYSTACK_CURRENCY,
      reference: uuidv4(),
      user_id: userId,
      wallet_id: senderWallet.id,
      receiver_wallet: receiverWallet.id,
    });

    const session = await this.knex.transaction();
    session<Transaction>('transactions')
      .where({ id: senderTransaction[0] })
      .update({ status: SUCCESS })
      .then(async () => {
        const transaction = await this.knex<Transaction>('transactions')
          .select('*')
          .where({ id: senderTransaction[0] })
          .first();
        const wallet = await this.knex<Wallet>('wallets')
          .select('*')
          .where({
            id: transaction.receiver_wallet,
          })
          .first();

        await session<Wallet>('wallets')
          .where('id', wallet.id)
          .increment('currentBalance', amount);

        await session<Wallet>('wallets')
          .where('id', transaction.wallet_id)
          .decrement('currentBalance', amount);

        await session<Transaction>('transactions').insert({
          amount: amount,
          mode: WALLET,
          type: CREDIT,
          status: SUCCESS,
          currency: PAYSTACK_CURRENCY,
          reference: uuidv4(),
          user_id: receiverWallet.user_id,
          wallet_id: senderWallet.id,
          receiver_wallet: receiverWallet.id,
        });
        return null;
      })
      .then(session.commit)
      .catch((err) => {
        console.log(err);
        return session.rollback;
      });

    return {
      message: 'Transfer Completed successfulyy',
    };
  }

  async initiateWithdrawal(
    userId: number,
    amount: number,
    accountId: number,
    transactionPin: string,
  ) {
    const user = await this.knex<User>('users').where({ id: userId }).first();

    if (user.transactionPin !== transactionPin) {
      throw new ForbiddenException('Invalid transaction pin');
    }

    const wallet = await this.knex<Wallet>('wallets')
      .where({ user_id: user.id })
      .first();

    let account = await this.knex<Account>('accounts')
      .where({ id: accountId })
      .first();

    if (wallet.currentBalance < amount / 100) {
      throw new ForbiddenException('Insufficient funds');
    }

    if (!account.recipient_code) {
      const newRecipient = await Paystack.createRecipient({
        name: account.account_name,
        account_number: account.account_number,
        bank_code: account.bank_code,
      });
      await this.knex<Account>('accounts').where({ id: accountId }).update({
        recipient_code: newRecipient.data.recipient_code,
      });

      account = await this.knex<Account>('accounts')
        .where({ id: accountId })
        .first();
    }

    const transfer = Paystack.initiateTransfer({
      amount,
      recipient: account.recipient_code,
    });

    return transfer;
  }
}
