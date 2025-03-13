import { ISendMailOptions } from "@nestjs-modules/mailer";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { JobName, QueueName } from "@shared/enum/queue.enum";
import { ISendSmsOptions } from "@shared/interface/sms.interface";
import { Queue } from "bullmq";

@Injectable()
export class VerificationProducer {
  constructor(@InjectQueue(QueueName.Verification) private verificationQueue: Queue) {}

  async sendMailProducer(payload: ISendMailOptions) {
    await this.verificationQueue.add(JobName.SendMail, payload, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: "fixed", delay: 30 * 1000 },
    });
  }

  async sendSmsProducer(payload: ISendSmsOptions) {
    await this.verificationQueue.add(JobName.SendSms, payload);
  }
}
