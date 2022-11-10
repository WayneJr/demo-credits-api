import { Knex } from 'knex';

const walletSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.string('tag').unique().notNullable();
  table.float('currentBalance').notNullable().defaultTo(0);
  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('id').inTable('users');
  table.timestamps(true);
};

export default walletSchema;
