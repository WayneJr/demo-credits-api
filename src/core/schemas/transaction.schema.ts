import { Knex } from 'knex';

const transactionSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.float('amount').notNullable();
  table.string('type').notNullable();
  table.string('status').notNullable();
  table.string('reference').notNullable();
  table.foreign('user').references('id').inTable('users');
  table.foreign('wallet').references('id').inTable('wallets');
  table.timestamps(true, true);
};

export default transactionSchema;
