import { Knex } from 'knex';
import userSchema from '../src/core/schemas/user.schema';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', userSchema);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
