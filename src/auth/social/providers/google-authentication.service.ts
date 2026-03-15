import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UserService } from 'src/users/providers/users.service';
import { GenerateTokenProvider } from 'src/auth/providers/generate-token.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  constructor(
    /**
     * Injecting jwt configuration
     */
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,

    /**
     * Injecting jwt configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /**
     * Injecting generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;

    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      //verify the Google token sent by user
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
        audience: this.jwtConfiguration.googleClientId, // Best practice to include audience
      });
      //Extract the payload from Google JWT
      // 2. Extract payload and check for existence
      const payload = loginTicket.getPayload();
      console.log(payload);

      if (!payload || !payload.email) {
        throw new UnauthorizedException(
          'Google authentication failed: No payload found',
        );
      }
      const {
        email: email,
        sub: googleId,
        given_name: firstName = '',
        family_name: lastName = '',
      } = payload;
      //Find the user in the database using the GoogleId & generate token
      const user = await this.usersService.findOneByGoogleId(googleId);
      if (user) {
        return await this.generateTokensProvider.generateToken(user);
      }
      //If the user does not exist, create one & generate token
      const newUser = await this.usersService.createGoogleUser({
        email,
        firstName,
        googleId,
        lastName,
      });
      return await this.generateTokensProvider.generateToken(newUser);
      //otherwise throw unauthorized exception
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
