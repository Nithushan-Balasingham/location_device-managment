/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    // Get the secret, provide fallback if undefined
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const secret: string =
      config.get<string>('AT_SECRET') || 'defaultSecretKey';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret, // Now `secret` is guaranteed to be a string
    });
  }

  validate(payload: JwtPayload) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return payload;
  }
}
