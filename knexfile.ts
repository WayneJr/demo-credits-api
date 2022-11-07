import type { Knex } from 'knex';
import serverConfig from './src/config/config';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
  },

  dev: {
    client: 'mysql2',
    connection: {
      host: serverConfig().DB_HOST,
      database: serverConfig().DB_NAME,
      user: serverConfig().DB_USER,
      password: serverConfig().DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  prod: {
    client: 'mysql2',
    connection: {
      host: serverConfig().DB_HOST,
      database: serverConfig().DB_NAME,
      user: serverConfig().DB_USER,
      password: serverConfig().DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

export default config;
