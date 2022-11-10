import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from 'nest-knexjs';
import { FakeKnex } from '../../core/utils/FakeKnex';
import { AccountService } from './account.service';
import { USERID } from '../../core/constants';
import { InternalServerErrorException } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getConnectionToken(),
          useClass: FakeKnex,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test get banks', () => {
    it('should return a list of banks', async () => {
      const spy = jest
        .spyOn(service, 'getBanks')
        .mockImplementationOnce(async () => {
          return ['test'];
        });

      const response = await service.getBanks();
      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual(['test']);
    });

    it('should throw a internal server exception error', async () => {
      const spy = jest
        .spyOn(service, 'getBanks')
        .mockImplementationOnce(async () => {
          throw new InternalServerErrorException('Internal Server Error');
        });

      try {
        await service.getBanks();
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('test addAccount to wallet', () => {
    it('should add an account to wallet', async () => {
      const spy = jest
        .spyOn(service, 'addAccountToWallet')
        .mockImplementationOnce(async () => ({
          status: true,
          message: 'Account number resolved',
          data: {
            account_number: '0001234567',
            account_name: 'Doe Jane Loren',
            bank_id: 9,
          },
        }));

      const response = await service.addAccountToWallet('0001234567', '67', 1);

      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual({
        status: true,
        message: 'Account number resolved',
        data: {
          account_number: '0001234567',
          account_name: 'Doe Jane Loren',
          bank_id: 9,
        },
      });
    });

    it('should throw a internal server exception error', async () => {
      const spy = jest
        .spyOn(service, 'addAccountToWallet')
        .mockImplementationOnce(async () => {
          throw new InternalServerErrorException('Internal Server Error');
        });

      try {
        await service.addAccountToWallet(null, null, null);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('test get wallet', () => {
    it('should get a wallet', async () => {
      const spy = jest
        .spyOn(service, 'getWallet')
        .mockImplementationOnce(async () => {
          return {
            id: 1,
            user_id: 1,
            balance: 0,
            created_at: '2021-01-01',
            updated_at: '2021-01-01',
          };
        });

      const response = await service.getWallet(1, USERID);

      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual({
        id: 1,
        user_id: 1,
        balance: 0,
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
      });
    });

    it('should throw a internal server exception error', async () => {
      const spy = jest
        .spyOn(service, 'getWallet')
        .mockImplementationOnce(async () => {
          throw new InternalServerErrorException('Internal Server Error');
        });

      try {
        await service.getWallet(null, null);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('test get accounts', () => {
    it('should return a list of accounts', async () => {
      const spy = jest
        .spyOn(service, 'getAccounts')
        .mockImplementationOnce(async () => {
          return [];
        });

      const response = await service.getAccounts(1, USERID);
      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual([]);
    });

    it('should throw a internal server exception error', async () => {
      const spy = jest
        .spyOn(service, 'getAccounts')
        .mockImplementationOnce(async () => {
          throw new InternalServerErrorException('Internal Server Error');
        });

      try {
        await service.getAccounts(null, null);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
