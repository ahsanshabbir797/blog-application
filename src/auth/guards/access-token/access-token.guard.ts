import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { IActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * Injecting jwt service
     */
    private readonly jwtService: JwtService,
    /**
     * Injecting jwt config
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Extract the request from the execution context
    const request: Request = context.switchToHttp().getRequest();
    //Extract the token from the request
    const token = this.extractTokenFromRequest(request);
    //Validate the token
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: IActiveUserData = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      console.log(payload);
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
