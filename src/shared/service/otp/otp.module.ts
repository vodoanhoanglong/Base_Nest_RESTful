import { VerificationLog } from "@database/entity/verification-code.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { OtpService } from "@shared/service/otp/otp.service";
import { QueueVerificationModule } from "@shared/service/queue/verification/verification.module";

@Module({
  imports: [QueueVerificationModule, MikroOrmModule.forFeature([VerificationLog])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
