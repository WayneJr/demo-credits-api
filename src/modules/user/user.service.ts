import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(): Promise<any> {
    const users: User[] = await this.knex<User>('users').select('*');
    return {
      users,
    };
  }

  async create(user: CreateUserDto) {
    const session = await this.knex.transaction();

    session('users')
      .insert(user)
      .then((ids) => {
        return session('wallets')
          .insert({
            user_id: ids[0],
            tag: user.tag,
          })
          .then(() => {
            return null;
          });
      })
      .then(session.commit)
      .catch(session.rollback);

    // const wallet = await this.knex('wallets').insert({});
    return {
      message: 'User created successfully',
    };
  }
}
