import { Knex } from 'knex';

const walletSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.string('tag').unique().notNullable();
  table.float('currentBalance').notNullable().defaultTo(0);
  table.integer('userId').unsigned().notNullable();
  table.foreign('userId').references('id').inTable('users');
  table.timestamps(true, true);
};

export default walletSchema;
