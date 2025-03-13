import { ISendMailOptions } from "@nestjs-modules/mailer";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { getErrorMessage } from "@shared/constant/error-message.constant";
import { getMessage } from "@shared/constant/message.constant";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { MessageCode } from "@shared/enum/message-code.enum";
import { JobName, QueueName } from "@shared/enum/queue.enum";
import { ISendSmsOptions } from "@shared/interface/sms.interface";
import { WinstonLogger } from "@shared/service/logger/winston.logger";
import { MailService } from "@shared/service/mail/mail.service";
import { CoolSmsService } from "@shared/service/sms/cool-sms.service";
import { Job } from "bullmq";

@Processor(QueueName.Verification)
export class VerificationConsumer extends WorkerHost {
  constructor(
    private readonly mailService: MailService,
    private readonly smsService: CoolSmsService,
  ) {
    super();
  }

  async process(job: Job<unknown, unknown, string>) {
    try {
      switch (job.name) {
        case JobName.SendMail:
          await this.sendMailJob(job.data as ISendMailOptions);
          break;
        case JobName.SendSms:
          await this.sendSmsJob(job.data as ISendSmsOptions);
          break;
        default:
          WinstonLogger.warn(getErrorMessage(ErrorCode.ConsumerNotFound, job.name));
      }
    } catch (error) {
      WinstonLogger.error(getErrorMessage(ErrorCode.ConsumerFailed, job.id, job.name), { metadata: error });
      throw error;
    }
  }

  @OnWorkerEvent("active")
  onActive(job: Job) {
    WinstonLogger.info(getMessage(MessageCode.JobProcessing, job.id, job.name), { metadata: { data: job.data } });
  }

  @OnWorkerEvent("completed")
  onComplete(job: Job) {
    WinstonLogger.info(getMessage(MessageCode.JobCompleted, job.id, job.name));
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job, error: Error) {
    WinstonLogger.error(getErrorMessage(ErrorCode.ProcessFailed, job.id, job.name, error.message), {
      metadata: { data: job.data, error },
    });
  }

  async sendMailJob(data: ISendMailOptions) {
    return await this.mailService.sendEmail(data);
  }

  async sendSmsJob(data: ISendSmsOptions) {
    return await this.smsService.sendSms(data);
  }
}
