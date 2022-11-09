import { Knex } from 'knex';
import {
  CREDIT,
  DEBIT,
  DEPOSIT,
  FAILED,
  PENDING,
  PROCESSING,
  SUCCESS,
  WALLET,
  WITHDRAW,
} from '../constants';

const walletTransactionSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.float('amount').notNullable();
  table.string('reference').notNullable();
  table.enum('mode', [WALLET, DEPOSIT, WITHDRAW]).notNullable();
  table.enum('type', [DEBIT, CREDIT]).notNullable();
  table.string('currency').notNullable();
  table.enum('status', [PENDING, PROCESSING, SUCCESS, FAILED]).notNullable();
  table.foreign('receiver').references('id').inTable('wallets').nullable();
  table.foreign('user').references('id').inTable('users');
};

export default walletTransactionSchema;
