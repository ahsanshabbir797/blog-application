import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/authType.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static defaultAuthType = AuthType.Bearer;
  private authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;
  constructor(
    /**
     * Injecting reflector class
     */
    private readonly reflector: Reflector,
    /**
     * Injecting accessTokenGuard
     */
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: {
        canActivate: () => true,
      },
    };
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Get the auth types from decorators
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const error = new UnauthorizedException();

    //map the authType enum as an array with respective guard instances of each
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    //loop through the newly formed guard instances to invoke canActivate method for each received authType
    for (const instance of guards) {
      try {
        const canActivate = await Promise.resolve(
          instance.canActivate(context),
        );
        if (canActivate) {
          return true;
        }
      } catch {
        continue;
      }
    }
    throw error;
  }
}
