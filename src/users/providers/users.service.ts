import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamsDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import type { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

/**
 * Class to connect to users table and perform business operations
 */
@Injectable()
export class UserService {
  /**
   * @ignore
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    // /**
    //  * Injecting config service
    //  */
    // private readonly configService: ConfigService,

    /**
     * Injecting module specific profile service
     */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    /**
     * Check is user exists with same email
     */
    let existingUser: User | null = null;
    /**
     * Handle exceptions for existing email or during create user db ops
     */
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email',
      );
    }

    let newUser = this.userRepository.create(createUserDto);
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    return newUser;
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
    console.log('User number:::', id);
    console.log('Type of number user:::', typeof id);
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
}
