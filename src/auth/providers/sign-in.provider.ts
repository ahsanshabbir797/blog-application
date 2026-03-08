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
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Injecting usersService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    /**
     * Injecting hashingProvider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Injecting jwt service
     */
    private readonly jwtService: JwtService,

    /**
     * Injecting jwt congiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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

    //4.return jwt token
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return { accessToken };
  }
}
