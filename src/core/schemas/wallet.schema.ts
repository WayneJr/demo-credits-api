import { Knex } from 'knex';

const walletSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.float('balance').notNullable();
  table.foreign('user').references('id').inTable('users');
  table.timestamps(true, true);
};

export default walletSchema;
