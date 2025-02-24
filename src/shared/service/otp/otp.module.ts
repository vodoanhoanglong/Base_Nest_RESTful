import { VerificationLog } from "@database/entity/verification-code.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { OtpService } from "@shared/service/otp/otp.service";
import { SmsModule } from "@shared/service/sms/sms.module";

@Module({
  imports: [SmsModule, MikroOrmModule.forFeature([VerificationLog])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
