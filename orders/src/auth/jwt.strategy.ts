import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

type JwtPayload = {
  sub: string;
  iss: string;
  aud?: string | string[];
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const issuer = process.env.KEYCLOAK_ISSUER!;
    const audience = process.env.KEYCLOAK_AUDIENCE!;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer,
      audience,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
      }),
      ignoreExpiration: false,
    });
  }
  validate(payload: JwtPayload) {
    if (!payload?.sub) throw new UnauthorizedException();
    return payload;
  }
}
