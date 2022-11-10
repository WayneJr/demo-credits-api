import { Knex } from 'knex';

const accountSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.string('bank_code').notNullable();
  table.string('account_name').notNullable();
  table.string('account_number').unique().notNullable();
  table.string('recipient_code').unique().nullable();
  table.integer('wallet_id').unsigned().notNullable();
  table.integer('user_id').unsigned().notNullable();
  table.foreign('wallet_id').references('id').inTable('wallets');
  table.foreign('user_id').references('id').inTable('users');
  table.timestamps(true, true);
};

export default accountSchema;
