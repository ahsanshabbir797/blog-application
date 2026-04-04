import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { UsersCreateManyProviderTs } from './users-create-many.provider.ts';
import { CreateUserProvider } from './create-user.provider';
import { FindonebyemailProvider } from './findonebyemail.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: UsersCreateManyProviderTs, useValue: {} },
        { provide: CreateUserProvider, useValue: mockCreateUserProvider },
        { provide: FindonebyemailProvider, useValue: {} },
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: CreateGoogleUserProvider, useValue: {} },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('Service should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.createUser).toBeDefined();
    });
    it('should call createUser on CreateUserProvider', async () => {
      const user = await userService.createUser({
        firstName: 'John',
        lastName: 'Connor',
        email: 'john@gmail.com',
        password: 'john',
      });
      expect(user.firstName).toEqual('John');
    });
  });
});
