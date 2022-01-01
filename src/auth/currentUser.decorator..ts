import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

import { JwtPayload } from './interfaces/jwt.payload';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const { user } = ctx.switchToHttp().getRequest();
    if (!user) {
      throw new HttpException(
        'Unable to deconstruct JWT payload',
        HttpStatus.FORBIDDEN,
      );
    }
    return user;
  },
);
