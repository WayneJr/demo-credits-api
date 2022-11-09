import { Knex } from 'knex';

const accountSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.string('bankCode').notNullable();
  table.string('accountName').notNullable();
  table.string('accountNumber').unique().notNullable();
  table.string('recipientCode').unique().nullable();
  table.integer('walletId').unsigned().notNullable();
  table.integer('userId').unsigned().notNullable();
  table.foreign('walletId').references('id').inTable('wallets');
  table.foreign('userId').references('id').inTable('users');
  table.timestamps(true, true);
};

export default accountSchema;
