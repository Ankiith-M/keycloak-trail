import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
  sub: string;
  iss: string;
  aud?: string | string[];
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    const issuer = config.get<string>('KEYCLOAK_ISSUER');
    const audience = config.get<string>('KEYCLOAK_AUDIENCE');

    if (!issuer || !audience) {
      // helpful during setup
      // eslint-disable-next-line no-console
      console.warn('JWT strategy missing env', { issuer, audience });
    } else {
      // eslint-disable-next-line no-console
      console.log('JWT strategy', {
        issuer,
        audience,
        jwks: `${issuer}/protocol/openid-connect/certs`,
      });
    }

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
    if (!payload?.sub) throw new UnauthorizedException('Missing sub');
    return payload; // -> req.user
  }
}
