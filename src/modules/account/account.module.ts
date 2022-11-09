import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ACCOUNT_SERVICE } from 'src/core/constants';

@Module({
  controllers: [AccountController],
  providers: [
    {
      provide: ACCOUNT_SERVICE,
      useClass: AccountService,
    },
  ],
})
export class AccountModule {}
