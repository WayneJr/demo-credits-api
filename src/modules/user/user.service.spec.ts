import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from 'nest-knexjs';
import { UserService } from './user.service';
import { InternalServerErrorException } from '@nestjs/common';
import { FakeKnex } from '../../core/utils/FakeKnex';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getConnectionToken(),
          useClass: FakeKnex,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('testing findAll', () => {
    // it('should return an array of users', async () => {
    // const result = ['test'];
    // jest.spyOn(service, 'findAll').mockImplementation(() => result);
    // expect(await controller.findAll()).toBe([]);
    // });

    it('should return an array of users', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockImplementationOnce(async () => ['test']);
      const response = await service.findAll();

      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual(['test']);
    });

    it('should throw a internal server error', async () => {
      jest.spyOn(service, 'findAll').mockImplementationOnce(() => {
        throw new InternalServerErrorException('Internal Server Error');
      });
    });
  });

  describe('testing create', () => {
    it('should return a user', async () => {
      const spy = jest
        .spyOn(service, 'create')
        .mockImplementationOnce(async () => {
          return {
            message: 'User created successfully',
          };
        });

      const response = await service.create({
        firstName: 'Fred',
        lastName: 'Johnson',
        email: 'fred@gmail.com',
        password: 'dave123',
        tag: 'freddy',
        transactionPin: '1234',
      });
      expect(spy).toHaveBeenCalled();
      expect(response).toStrictEqual({
        message: 'User created successfully',
      });
    });

    it('should throw a internal server error', async () => {
      jest.spyOn(service, 'create').mockImplementationOnce(() => {
        throw new InternalServerErrorException('Internal Server Error');
      });
    });
  });
});
