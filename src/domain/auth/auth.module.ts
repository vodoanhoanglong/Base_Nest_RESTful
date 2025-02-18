import { ENVIRONMENT } from "@core/config/env.config";
import { Account } from "@database/entity/account.entity";
import { AuthController } from "@domain/auth/auth.controller";
import { AuthService } from "@domain/auth/auth.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { StrategyKey } from "@shared/enum/strategy.enum";
import { JwtStrategy } from "@shared/service/jwt/jwt.strategy";
import { RedisModule } from "@shared/service/redis/redis.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: StrategyKey.JWT }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: ENVIRONMENT.JWT_SECRET,
        signOptions: { expiresIn: ENVIRONMENT.JWT_EXPIRED },
      }),
    }),
    MikroOrmModule.forFeature([Account]),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
