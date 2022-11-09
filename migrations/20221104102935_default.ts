import { Knex } from 'knex';
import transactionSchema from '../src/core/schemas/transaction.schema';
import walletSchema from '../src/core/schemas/wallet.schema';
import userSchema from '../src/core/schemas/user.schema';
import accountSchema from '../src/core/schemas/account.schema';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', userSchema)
    .createTable('wallets', walletSchema)
    .createTable('accounts', accountSchema)
    .createTable('transactions', transactionSchema);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('transactions')
    .dropTableIfExists('accounts')
    .dropTableIfExists('wallets')
    .dropTableIfExists('users');
}
