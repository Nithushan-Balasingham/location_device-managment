import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    if (!request.user) {
      throw new Error('User not found in request');
    }

    return request.user.sub;
  },
);
