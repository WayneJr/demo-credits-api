import { Knex } from 'knex';
import {
  PENDING,
  PROCESSING,
  SUCCESS,
  FAILED,
  DEBIT,
  CREDIT,
  DEPOSIT,
  WALLET,
  WITHDRAW,
} from '../constants';

const transactionSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.float('amount').notNullable();
  table.enum('mode', [WALLET, DEPOSIT, WITHDRAW]).notNullable();
  table.enum('type', [DEBIT, CREDIT]).notNullable();
  table.enum('status', [PENDING, PROCESSING, SUCCESS, FAILED]).notNullable();
  table.string('currency').notNullable();
  table.string('reference').notNullable();
  table.integer('user_id').unsigned().notNullable();
  table.integer('receiver_wallet').unsigned().nullable();
  table.integer('wallet_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users');
  table.foreign('receiver_wallet').references('id').inTable('wallets');
  table.foreign('wallet_id').references('id').inTable('wallets');
  table.timestamps(true);
};

export default transactionSchema;
