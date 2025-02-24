import { ENVIRONMENT } from "@core/config/env.config";
import { Injectable } from "@nestjs/common";
import { NodeEnv } from "@shared/enum/environment.enum";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { CustomError } from "@shared/helper/error";
import { ISendSmsOptions } from "@shared/interface/sms.interface";
import { WinstonLogger } from "@shared/service/logger/winston.logger";
import chalk from "chalk";
import CoolSms from "coolsms-node-sdk";

@Injectable()
export class CoolSmsService {
  private readonly coolSms: CoolSms;
  constructor() {
    this.coolSms = new CoolSms(ENVIRONMENT.COOL_SMS_KEY, ENVIRONMENT.COOL_SMS_SECRET);
  }

  async sendSms({ message, to }: ISendSmsOptions): Promise<void> {
    try {
      if (!ENVIRONMENT.SMS_ENABLE || ENVIRONMENT.NODE_ENV === NodeEnv.Local) return;

      if ((await this.coolSms.getBalance()).balance > 0)
        await this.coolSms.sendOne({
          to,
          text: message,
          from: ENVIRONMENT.COOL_SMS_NUMBER,
          autoTypeDetect: true,
        });
    } catch (error) {
      WinstonLogger.error(`${chalk.redBright(CoolSmsService.name)}`, { metadata: error });
      throw new CustomError(ErrorCode.SendSmsFailed, to);
    }
  }
}
