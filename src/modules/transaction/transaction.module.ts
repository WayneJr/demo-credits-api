import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TRANSACTION_SERVICE } from 'src/core/constants';

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
  ],
})
export class TransactionModule {}
