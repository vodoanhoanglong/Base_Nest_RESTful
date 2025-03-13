import { Account } from "@database/entity/account.entity";
import { VerificationLog } from "@database/entity/verification-code.entity";
import { AuthController } from "@domain/auth/auth.controller";
import { AuthService } from "@domain/auth/auth.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TokenStrategyKey } from "@shared/enum/token.enum";
import { OtpModule } from "@shared/service/otp/otp.module";
import { QueueVerificationModule } from "@shared/service/queue/verification/verification.module";
import { JwtStrategy } from "@shared/service/token/jwt.strategy";
import { TokenModule } from "@shared/service/token/token.module";

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: TokenStrategyKey.Jwt }),
    MikroOrmModule.forFeature([Account, VerificationLog]),
    OtpModule,
    TokenModule,
    QueueVerificationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
