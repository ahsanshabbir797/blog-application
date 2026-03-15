import { Body, Controller, Post } from '@nestjs/common';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/authType.enum';

@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    /**
     * Injecting google authentication service
     */
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  public async authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return await this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
