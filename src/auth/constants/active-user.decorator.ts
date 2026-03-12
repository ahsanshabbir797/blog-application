import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from './auth.constants';
import { Request } from 'express';

export const ActiveUser = createParamDecorator(
  (field: keyof IActiveUserData | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: IActiveUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
