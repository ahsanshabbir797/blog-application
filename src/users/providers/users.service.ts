import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamsDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

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
  ) {}
  /**
   * The method to get all the users from the database
   */
  public findAll(
    getUsersParamsDto: GetUsersParamsDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log('isauth in findall:::', isAuth);
    return [
      {
        name: 'John',
        email: 'john@johndoe.com',
      },
      {
        name: 'May',
        email: 'may@may.com',
      },
    ];
  }

  /**
   * Find a single user using the ID of the user
   */
  public findOneById(id: string) {
    return {
      id: 1234,
      name: 'May',
      email: 'may@may.com',
    };
  }
}
