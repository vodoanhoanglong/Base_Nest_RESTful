import { ENVIRONMENT } from "@core/config/env.config";
import { Account } from "@database/entity/account.entity";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { TokenIssuer } from "@shared/enum/token.enum";
import { CustomError } from "@shared/helper/error";
import { IJwtPayload } from "@shared/interface/jwt-payload.interface";
import * as md5 from "md5";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(account: Account) {
    const payload = { sub: account.id, role: account.role } as IJwtPayload;

    return this.jwtService.sign(payload, {
      issuer: TokenIssuer.Access,
      secret: ENVIRONMENT.JWT_SECRET,
      expiresIn: ENVIRONMENT.JWT_EXPIRED,
    });
  }

  generateSensitiveToken(account: Account) {
    const payload = { sub: account.id, role: account.role } as IJwtPayload;

    return this.jwtService.sign(payload, {
      issuer: TokenIssuer.Sensitive,
      secret: ENVIRONMENT.JWT_SENSITIVE_SECRET,
      expiresIn: ENVIRONMENT.JWT_EXPIRED,
    });
  }

  private generateRefreshTokenSecret(token: string, secret: string) {
    return secret.substring(0, 24) + md5(token).substring(0, 8);
  }

  generateRefreshToken(account: Account, token: string, secretKey: string) {
    const payload = { sub: account.id, role: account.role } as IJwtPayload;
    const secret = this.generateRefreshTokenSecret(token, secretKey);

    return this.jwtService.sign(payload, {
      issuer: TokenIssuer.Refresh,
      secret,
    });
  }

  validateRefreshToken(token: string, refreshToken: string, secretKey: string) {
    try {
      const decryptedSecret = this.generateRefreshTokenSecret(token, secretKey);
      const accountInfo = this.jwtService.verify<IJwtPayload>(refreshToken, { secret: decryptedSecret });

      return accountInfo;
    } catch (error) {
      throw new CustomError(ErrorCode.InvalidToken);
    }
  }
}
