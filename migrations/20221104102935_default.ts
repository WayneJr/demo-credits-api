import { Knex } from 'knex';
import transactionSchema from '../src/core/schemas/transaction.schema';
import walletSchema from '../src/core/schemas/wallet.schema';
import userSchema from '../src/core/schemas/user.schema';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', userSchema)
    .createTable('transactions', transactionSchema)
    .createTable('wallets', walletSchema);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
