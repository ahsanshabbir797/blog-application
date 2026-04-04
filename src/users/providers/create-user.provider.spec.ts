import { Test } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('CreateUserProvider', () => {
  let provider: CreateUserProvider;
  let usersRepository: MockRepository;
  const user: CreateUserDto = {
    firstName: 'john',
    lastName: 'connor',
    email: 'john@gmail.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: MailService,
          useValue: { sendUserWelcome: jest.fn(() => Promise.resolve()) },
        },
        {
          provide: HashingProvider,
          useValue: { hashPassword: jest.fn(() => user.password) },
        },
      ],
    }).compile();
    provider = module.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('Service should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createUser method', () => {
    describe('when the user does not exist in database', () => {
      it('should create a user', async () => {
        usersRepository.findOne?.mockReturnValue(null);
        usersRepository.create?.mockReturnValue(user);
        usersRepository.save?.mockReturnValue(user);
        const newUser = await provider.createUser(user);
        console.log(newUser);
        expect(newUser).toEqual(user);
        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: { email: user.email },
        });
        expect(usersRepository.create).toHaveBeenCalledWith(user);
        expect(usersRepository.save).toHaveBeenCalledWith(user);
      });
    });

    describe('when the user exists', () => {
      it('should throw BadRequestException', async () => {
        usersRepository.findOne?.mockReturnValue(user.email);
        usersRepository.create?.mockReturnValue(user);
        usersRepository.save?.mockReturnValue(user);
        try {
          const newUser = await provider.createUser(user);
          console.log(newUser);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
