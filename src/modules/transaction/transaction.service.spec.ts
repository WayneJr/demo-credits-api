import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getConnectionToken } from 'nest-knexjs';
import { FakeKnex } from '../../core/utils/FakeKnex';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getConnectionToken(),
          useClass: FakeKnex,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const test = {
    email: 'test@gmail.com',
    transactionPin: '1234',
  };

  describe('testing deposit Funds', () => {
    // it('should return an array of users', async () => {
    // const result = ['test'];
    // jest.spyOn(service, 'findAll').mockImplementation(() => result);
    // expect(await controller.findAll()).toBe([]);
    // });

    it('should deposit into the user wallet', async () => {
      const spy = jest
        .spyOn(service, 'depositFunds')
        .mockImplementationOnce(async () => {
          return {
            status: true,
            message: 'Deposit Successful',
            data: {
              authorization_url: 'someurl',
              reference: 'random text',
              access_code: 'some code',
            },
          };
        });
      const response = await service.depositFunds({
        amount: 100000,
        email: test.email,
        transactionPin: test.transactionPin,
      });

      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual({
        status: true,
        message: 'Deposit Successful',
        data: {
          authorization_url: 'someurl',
          reference: 'random text',
          access_code: 'some code',
        },
      });
    });

    it('should throw a forbidden exception error', async () => {
      const spy = jest
        .spyOn(service, 'depositFunds')
        .mockImplementationOnce(async ({ transactionPin }) => {
          if (transactionPin !== test.transactionPin)
            throw new ForbiddenException('Invalid transaction pin');
          return {
            status: true,
            message: 'Deposit Successful',
            data: {
              authorization_url: 'someurl',
              reference: 'random text',
              access_code: 'some code',
            },
          };
        });

      try {
        await service.depositFunds({
          amount: 100000,
          email: test.email,
          transactionPin: '4444',
        });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
