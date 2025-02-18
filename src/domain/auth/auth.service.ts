import { Account } from "@database/entity/account.entity";
import { SignInRequest } from "@domain/auth/request/SignIn.request";
import { SignUpRequest } from "@domain/auth/request/SignUp.request";
import { SignInResponse } from "@domain/auth/response/SignIn.response";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getErrorMessage } from "@shared/constant/error-message.constant";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { RedisKey } from "@shared/enum/redis-key.enum";
import { hashPassword, verifyPassword } from "@shared/helper/hash";
import { BaseResponse } from "@shared/helper/response";
import { IJwtPayload } from "@shared/interface/jwt-payload.interface";
import { RedisService } from "@shared/service/redis/redis.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @InjectRepository(Account) private readonly accountRepository: EntityRepository<Account>,
  ) {}

  async generateToken(account: Account) {
    const payload = { sub: account.id, role: account.role } as IJwtPayload;
    return this.jwtService.sign(payload);
  }

  async signIn(request: SignInRequest) {
    try {
      const account = await this.accountRepository.findOne({ email: request.email, isActive: true });
      if (!account) throw new Error(getErrorMessage(ErrorCode.InvalidEmailOrPassword));

      const isMatch = await verifyPassword(request.password, account.password);
      if (!isMatch) throw new Error(getErrorMessage(ErrorCode.InvalidEmailOrPassword));

      const accessToken = await this.generateToken(account);
      await this.redisService.set(`${RedisKey.Account}${account.id}`, JSON.stringify(account));
      return BaseResponse.of(SignInResponse.fromEntity(account, accessToken));
    } catch (error) {
      throw error;
    }
  }

  async signUp(request: SignUpRequest) {
    try {
      const accountExisted = await this.accountRepository.findOne(
        { email: request.email, isActive: true },
        { fields: ["id"] as Array<keyof Account> },
      );

      if (accountExisted) throw new Error(getErrorMessage(ErrorCode.ExistedEmail));

      const hashedPassword = await hashPassword(request.password);

      await this.accountRepository.insert(SignUpRequest.toCreateInput(request, hashedPassword));
      return BaseResponse.ok();
    } catch (error) {
      throw error;
    }
  }
}
