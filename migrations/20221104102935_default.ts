import { Knex } from 'knex';
import transactionSchema from '../src/core/schemas/transaction.schema';
import walletSchema from '../src/core/schemas/wallet.schema';
import userSchema from '../src/core/schemas/user.schema';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', userSchema)
    .createTable('wallets', walletSchema)
    .createTable('transactions', transactionSchema);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('wallets')
    .dropTableIfExists('transactions');
}
