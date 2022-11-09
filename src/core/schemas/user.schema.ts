import { Knex } from 'knex';

const userSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary();
  table.string('firstName').notNullable();
  table.string('lastName').notNullable();
  table.string('tag').unique().notNullable();
  table.string('transactionPin', 4).notNullable();
  table.string('email').notNullable().unique();
  table.string('password').notNullable();
  table.timestamps(true, true);
};

export default userSchema;
