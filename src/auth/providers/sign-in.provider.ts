import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UserService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Injecting usersService
     */
    @Inject(forwardRef(() => UserService))
    private userService: UserService,

    /**
     * Injecting hashingProvider
     */
    private hashingProvider: HashingProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    //1.lookup the email
    //2.Throw an exception if not found
    const user = await this.userService.findOneByEmail(signInDto.email);

    let hasMatched = false;

    try {
      //3.Compare the password hashes
      hasMatched = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not match passwords',
      });
    }

    if (!hasMatched) {
      throw new UnauthorizedException('Password is incorrect');
    }

    //4.return confirmatiomn
    return true;
  }
}
