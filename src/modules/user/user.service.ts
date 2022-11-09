import { ForbiddenException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Request } from 'express';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/user.dto';
import { Paystack } from '../../core/utils/Paystack';
import { Transaction } from './interfaces/transaction.interface';
import { ConfigService } from '@nestjs/config';
import { WebhookPayload } from '../../core/utils/interfaces/paystack.interface';
import {
  CREDIT,
  DEPOSIT,
  PAYSTACK_CURRENCY,
  PROCESSING,
  SUCCESS,
} from 'src/core/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private config: ConfigService,
  ) {}

  async findAll(): Promise<any> {
    const users: User[] = await this.knex<User>('users').select('*');
    return {
      users,
    };
  }

  async create(user: CreateUserDto) {
    let response: {
      id: number;
      walletId: number;
    } = null;
    const session = await this.knex.transaction();

    session('users')
      .insert(user)
      .then((id) => {
        return session('wallets')
          .insert({
            user_id: id[0],
            tag: user.tag,
          })
          .then((walletId) => {
            response = {
              id: id[0],
              walletId: walletId[0],
            };
            return null;
          });
      })
      .then(session.commit)
      .catch(session.rollback);

    // const newUser = await this.knex<User>('users').insert(user);

    // const wallet = await this.knex('wallets').insert({});
    return response;
  }

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
    console.log(user);
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

    const transaction = await this.knex<Transaction>('transactions').insert({
      amount,
      mode: DEPOSIT,
      type: CREDIT,
      status: PROCESSING,
      currency: PAYSTACK_CURRENCY,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
        session('transactions')
          .where({ reference: event.data.reference })
          .update({ status: SUCCESS })
          .then((id) => {
            console.log(id);
            return null;
          })
          .then(session.commit)
          .catch(session.rollback);
      }
    }
  }
}
