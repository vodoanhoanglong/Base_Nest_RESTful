import { Module } from "@nestjs/common";
import { CoolSmsService } from "@shared/service/sms/cool-sms.service";

@Module({
  providers: [CoolSmsService],
  exports: [CoolSmsService],
})
export class SmsModule {}
