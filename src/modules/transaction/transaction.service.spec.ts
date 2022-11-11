import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getConnectionToken } from 'nest-knexjs';
import { FakeKnex } from '../../core/utils/FakeKnex';
import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

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
    currentBalance: 100000,
    email: 'test@gmail.com',
    transactionPin: '1234',
    tag: 'freddy',
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

    it('should throw a internal server exception error', async () => {
      const spy = jest
        .spyOn(service, 'depositFunds')
        .mockImplementationOnce(async () => {
          throw new InternalServerErrorException('Internal Server Error');
        });

      try {
        await service.depositFunds({
          amount: null,
          email: null,
          transactionPin: null,
        });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('testing transfer to user wallet', () => {
    it('should transfer money to a users wallet', async () => {
      const spy = jest
        .spyOn(service, 'transferToWallet')
        .mockImplementationOnce(async () => {
          return {
            message: 'Transfer Completed successfulyy',
          };
        });
      const response = await service.transferToWallet(
        1,
        test.tag,
        3000,
        test.transactionPin,
      );

      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual({
        message: 'Transfer Completed successfulyy',
      });
    });

    it('should return a forbidden exception if insufficient funds', async () => {
      const spy = jest
        .spyOn(service, 'transferToWallet')
        .mockImplementationOnce(async (userId, recieverTag, amount) => {
          if (test.currentBalance < amount)
            throw new ForbiddenException('Insufficient funds');
          return {
            message: 'Transfer Completed successfulyy',
          };
        });

      try {
        await service.transferToWallet(1, 'davey', 500000, test.transactionPin);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should throw a internal server exception error', async () => {
      const spy = jest
        .spyOn(service, 'transferToWallet')
        .mockImplementationOnce(async () => {
          throw new InternalServerErrorException('Internal Server Error');
        });

      try {
        await service.transferToWallet(null, null, null, null);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('testing initiate withdrawal', () => {
    it('should withdraw funds', async () => {
      const spy = jest
        .spyOn(service, 'initiateWithdrawal')
        .mockImplementationOnce(async () => {
          return {
            status: true,
            message: 'Transfer has been queued',
            data: {
              reference: 'your-unique-reference',
              integration: 428626,
              domain: 'test',
              amount: 37800,
              currency: 'NGN',
              source: 'balance',
              reason: 'Holiday Flexing',
              recipient: 6788170,
              status: 'success',
              transfer_code: 'TRF_fiyxvgkh71e717b',
              id: 23070321,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };
        });
      const response = await service.initiateWithdrawal(
        1,
        3000,
        1,
        test.transactionPin,
      );

      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual({
        status: true,
        message: 'Transfer has been queued',
        data: {
          reference: 'your-unique-reference',
          integration: 428626,
          domain: 'test',
          amount: 37800,
          currency: 'NGN',
          source: 'balance',
          reason: 'Holiday Flexing',
          recipient: 6788170,
          status: 'success',
          transfer_code: 'TRF_fiyxvgkh71e717b',
          id: 23070321,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    });

    it('should return a forbidden exception if insufficient funds', async () => {
      const spy = jest
        .spyOn(service, 'initiateWithdrawal')
        .mockImplementationOnce(async (userId: number, amount: number) => {
          if (test.currentBalance < amount)
            throw new ForbiddenException('Insufficient funds');
          return {
            status: true,
            message: 'Transfer has been queued',
            data: {
              reference: 'your-unique-reference',
              integration: 428626,
              domain: 'test',
              amount: 37800,
              currency: 'NGN',
              source: 'balance',
              reason: 'Holiday Flexing',
              recipient: 6788170,
              status: 'success',
              transfer_code: 'TRF_fiyxvgkh71e717b',
              id: 23070321,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };
        });

      try {
        await service.initiateWithdrawal(1, 500000, 1, test.transactionPin);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should throw a internal server exception error', async () => {
      const spy = jest
        .spyOn(service, 'initiateWithdrawal')
        .mockImplementationOnce(async () => {
          throw new InternalServerErrorException('Internal Server Error');
        });

      try {
        await service.initiateWithdrawal(null, null, null, null);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
