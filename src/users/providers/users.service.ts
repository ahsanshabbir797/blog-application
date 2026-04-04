import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamsDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProviderTs } from './users-create-many.provider.ts';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindonebyemailProvider } from './findonebyemail.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { IGoogleUser } from '../interfaces/google-user.interface';
import { CreateGoogleUserProvider } from './create-google-user.provider';

/**
 * Class to connect to users table and perform business operations
 */
@Injectable()
export class UserService {
  /**
   * @ignore
   */
  constructor(
    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /**
     * Injecting createManyUsers Provider
     */
    private usersCreateManyProvider: UsersCreateManyProviderTs,

    /**
     * Injecting createManyUsers Provider
     */
    private createUserProvider: CreateUserProvider,

    /**
     * Injecting findonebyemail provider
     */
    private findOneByEmailProvider: FindonebyemailProvider,

    /**
     * Injecting findOneByGoogleIdProvider
     */
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

    /**
     * Injecting createGoogleUserProvider
     */
    private createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersParamsDto: GetUsersParamsDto,
    limit: number,
    page: number,
  ) {
    // const isAuth = this.authService.isAuth();
    console.log(getUsersParamsDto, limit, page);
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist.',
        fileName: 'users.service.ts',
        lineNumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description:
          'The error occured because the endpoint was permanently moved',
      },
    );

    // const environment = this.configService.get<string>('S3_BUCKET');
    // console.log('environment', environment);

    // console.log('Profile config:::', this.profileConfiguration);

    // console.log('isauth in findall:::', isAuth, getUsersParamsDto, limit, page);
    // return [
    //   {
    //     name: 'John',
    //     email: 'john@johndoe.com',
    //   },
    //   {
    //     name: 'May',
    //     email: 'may@may.com',
    //   },
    // ];
  }

  /**
   * Find a single user using the ID of the user
   */
  public async findOneById(id: number): Promise<User | null> {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    if (!user) {
      throw new BadRequestException('The user id does not exist!');
    }

    return user;
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneByEmailProvider.findUserByEmail(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: IGoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
