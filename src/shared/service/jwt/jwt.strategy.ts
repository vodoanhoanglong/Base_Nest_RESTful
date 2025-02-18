import { ENVIRONMENT } from "@core/config/env.config";
import { Account } from "@database/entity/account.entity";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { RedisKey } from "@shared/enum/redis-key.enum";
import { Role } from "@shared/enum/role.enum";
import { StrategyKey } from "@shared/enum/strategy.enum";
import { IJwtPayload } from "@shared/interface/jwt-payload.interface";
import { RedisService } from "@shared/service/redis/redis.service";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyKey.JWT) {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Account) private readonly accountRepository: EntityRepository<Account>,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: ENVIRONMENT.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload) {
    const cachedAccount = (await this.redisService.get(`${RedisKey.Account}${payload.sub}`)) as string;

    if (cachedAccount) {
      const account = JSON.parse(cachedAccount) as Account;
      return { id: account.id, role: account.role };
    }

    const account = await this.accountRepository.findOne({ id: payload.sub, isActive: true });

    return account ? { id: account.id, role: account.role } : { id: payload.sub, role: Role.Anonymous };
  }
}
