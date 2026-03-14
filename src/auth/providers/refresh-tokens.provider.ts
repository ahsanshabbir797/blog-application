import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { UserService } from 'src/users/providers/users.service';
import { GenerateTokenProvider } from './generate-token.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { IActiveUserData } from '../interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * Injecting generate token service
     */
    private readonly generateTokenProvider: GenerateTokenProvider,
    /**
     * Injecting usersService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      //verify the token using jwt service
      const { sub } = await this.jwtService.verifyAsync<
        Pick<IActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      //fetch the user using user id
      const user: User | null = await this.userService.findOneById(sub);
      if (!user) {
        throw new UnauthorizedException('Unable to authorize!');
      }
      //generate the fresh tokens
      return await this.generateTokenProvider.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException(error, {
        description: 'Unable to authenticate',
      });
    }
  }
}
