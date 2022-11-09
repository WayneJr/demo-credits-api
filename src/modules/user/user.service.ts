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
    let response: {
      id: number;
      walletId: number;
    } = null;
    const session = await this.knex.transaction();

    session('users')
      .insert(user)
      .then((id) => {
        return session('wallets')
          .insert({
            userId: id[0],
            tag: user.tag,
          })
          .then((walletId) => {
            response = {
              id: id[0],
              walletId: walletId[0],
            };
            return null;
          });
      })
      .then(session.commit)
      .catch(session.rollback);

    // const newUser = await this.knex<User>('users').insert(user);

    // const wallet = await this.knex('wallets').insert({});
    return response;
  }
}
