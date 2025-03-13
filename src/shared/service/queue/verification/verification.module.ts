import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { QueueName } from "@shared/enum/queue.enum";
import { MailModule } from "@shared/service/mail/mail.module";
import { VerificationConsumer } from "@shared/service/queue/verification/verification.consumer";
import { VerificationProducer } from "@shared/service/queue/verification/verification.producer";
import { SmsModule } from "@shared/service/sms/sms.module";

@Module({
  imports: [BullModule.registerQueue({ name: QueueName.Verification }), MailModule, SmsModule],
  providers: [VerificationProducer, VerificationConsumer],
  exports: [VerificationProducer],
})
export class QueueVerificationModule {}
