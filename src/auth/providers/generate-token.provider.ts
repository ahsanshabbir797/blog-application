import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    /**
     * Injecting jwt service
     */
    private readonly jwtService: JwtService,

    /**
     * Injecting jwt congiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  public async generateToken(sub: number, expiresIn: number, payload: any) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return accessToken;
  }
}
