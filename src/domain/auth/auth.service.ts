import { ENVIRONMENT } from "@core/config/env.config";
import { Account } from "@database/entity/account.entity";
import { VerificationLog } from "@database/entity/verification-code.entity";
import { ConfirmVerificationRequest } from "@domain/auth/request/ConfirmVerification.request";
import { RefreshTokenRequest } from "@domain/auth/request/RefreshToken.request";
import { SendVerificationRequest } from "@domain/auth/request/SendVerification.request";
import { SignInRequest } from "@domain/auth/request/SignIn.request";
import { SignUpRequest } from "@domain/auth/request/SignUp.request";
import { SignInResponse } from "@domain/auth/response/SignIn.response";
import { VerificationCodeResponse } from "@domain/auth/response/VerificationCode.response";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { RedisKey } from "@shared/enum/redis-key.enum";
import { TokenIssuer } from "@shared/enum/token.enum";
import { VerificationType } from "@shared/enum/verification.enum";
import { CustomError } from "@shared/helper/error";
import { hashPassword, verifyPassword } from "@shared/helper/hash";
import { BaseResponse } from "@shared/helper/response";
import { IJwtDecoded } from "@shared/interface/jwt-payload.interface";
import { OtpService } from "@shared/service/otp/otp.service";
import { RedisService } from "@shared/service/redis/redis.service";
import { TokenService } from "@shared/service/token/token.service";
import * as moment from "moment";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    @InjectRepository(Account) private readonly accountRepository: EntityRepository<Account>,
    @InjectRepository(VerificationLog) private readonly verificationLogRepository: EntityRepository<VerificationLog>,
  ) {}

  private async validateSignUp(request: SignUpRequest) {
    try {
      const { phoneNumber } = request;

      const prevVerification = await this.verificationLogRepository.findOne(
        { phoneNumber, isActive: false },
        { orderBy: { createdAt: "DESC" } },
      );

      if (!prevVerification) throw new CustomError(ErrorCode.VerificationNotFound);
      if (
        moment().isAfter(moment.unix(prevVerification.confirmedAt).add({ seconds: ENVIRONMENT.VERIFICATION_SESSION }))
      )
        throw new CustomError(ErrorCode.VerificationSessionExpired);

      const accountExisted = await this.accountRepository.findOne(
        { email: request.email, isActive: true },
        { fields: ["id"] as Array<keyof Account> },
      );

      if (accountExisted) throw new CustomError(ErrorCode.ExistedEmail);
    } catch (error) {
      throw error;
    }
  }

  async signIn(request: SignInRequest) {
    try {
      const account = await this.accountRepository.findOne({ email: request.email, isActive: true });
      if (!account) throw new CustomError(ErrorCode.InvalidEmailOrPassword);

      const isMatch = await verifyPassword(request.password, account.password);
      if (!isMatch) throw new CustomError(ErrorCode.InvalidEmailOrPassword);

      const accessToken = this.tokenService.generateAccessToken(account);
      const refreshToken = this.tokenService.generateRefreshToken(account, accessToken, ENVIRONMENT.JWT_SECRET);

      await this.redisService.set(`${RedisKey.Account}${account.id}`, account, ENVIRONMENT.JWT_EXPIRED);

      return BaseResponse.of(SignInResponse.fromEntity(account, accessToken, refreshToken));
    } catch (error) {
      throw error;
    }
  }

  async signUp(request: SignUpRequest) {
    try {
      await this.validateSignUp(request);
      const hashedPassword = await hashPassword(request.password);
      await this.accountRepository.insert(SignUpRequest.toCreateInput(request, hashedPassword));

      return BaseResponse.ok();
    } catch (error) {
      throw error;
    }
  }

  async sendVerification(request: SendVerificationRequest) {
    try {
      switch (request.verificationType) {
        case VerificationType.Otp:
          const expireAt = await this.otpService.sendOtp(request.phoneNumber!);
          return BaseResponse.of(VerificationCodeResponse.transformOtpData(expireAt));
        case VerificationType.Email:
          return BaseResponse.ok();
        default:
          throw new CustomError(ErrorCode.InvalidVerificationType);
      }
    } catch (error) {
      throw error;
    }
  }

  async confirmVerification(request: ConfirmVerificationRequest) {
    try {
      switch (request.verificationType) {
        case VerificationType.Otp:
          await this.otpService.confirmOtp(request.phoneNumber!, request.code);
          return BaseResponse.ok();
        case VerificationType.Email:
          return BaseResponse.ok();
        default:
          throw new CustomError(ErrorCode.InvalidVerificationType);
      }
    } catch (error) {
      throw error;
    }
  }

  async refreshNewToken(request: RefreshTokenRequest) {
    try {
      const { token, refreshToken } = request;

      const decodedToken = this.jwtService.decode<IJwtDecoded>(token, { complete: true });
      if (!decodedToken || typeof decodedToken !== "object") throw new CustomError(ErrorCode.InvalidDecodeToken);

      let secret = "";

      if (decodedToken.payload.iss === TokenIssuer.Access) secret = ENVIRONMENT.JWT_SECRET;
      else if (decodedToken.payload.iss === TokenIssuer.Sensitive) secret = ENVIRONMENT.JWT_SENSITIVE_SECRET;

      if (!secret) throw new CustomError(ErrorCode.InvalidTokenSecret);

      const refreshTokenPayload = this.tokenService.validateRefreshToken(token, refreshToken, secret);

      const account = await this.accountRepository.findOne({ id: refreshTokenPayload.sub, isActive: true });
      if (!account) throw new CustomError(ErrorCode.Unauthenticated);

      const newAccessToken = this.tokenService.generateAccessToken(account);
      const newRefreshToken = this.tokenService.generateRefreshToken(account, newAccessToken, ENVIRONMENT.JWT_SECRET);

      await this.redisService.set(`${RedisKey.Account}${account.id}`, account, ENVIRONMENT.JWT_EXPIRED);

      return BaseResponse.of(SignInResponse.fromEntity(account, newAccessToken, newRefreshToken));
    } catch (error) {
      throw error;
    }
  }
}
