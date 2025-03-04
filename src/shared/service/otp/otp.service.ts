import { ENVIRONMENT } from "@core/config/env.config";
import { VerificationLog } from "@database/entity/verification-code.entity";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { getSmsMessage } from "@shared/constant/sms-message.constant";
import { NodeEnv } from "@shared/enum/environment.enum";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { RedisKey } from "@shared/enum/redis-key.enum";
import { SmsCode } from "@shared/enum/sms-code.enum";
import { VerificationBehavior, VerificationType } from "@shared/enum/verification.enum";
import { CustomError } from "@shared/helper/error";
import { randomNumber } from "@shared/helper/random";
import { RedisService } from "@shared/service/redis/redis.service";
import { CoolSmsService } from "@shared/service/sms/cool-sms.service";
import * as moment from "moment";

@Injectable()
export class OtpService {
  private OTP_EXPIRE_TIME = ENVIRONMENT.OTP_EXPIRE_TIME;
  private OTP_LENGTH = ENVIRONMENT.OTP_LENGTH;
  private OTP_LIMIT = ENVIRONMENT.OTP_LIMIT;
  private OTP_DAY_LIMIT = ENVIRONMENT.OTP_DAY_LIMIT;
  private OTP_TESTING = "0000";

  constructor(
    private readonly redis: RedisService,
    private readonly sms: CoolSmsService,
    @InjectRepository(VerificationLog) private readonly verificationLogRepository: EntityRepository<VerificationLog>,
  ) {}

  private generateOtp() {
    return !ENVIRONMENT.SMS_ENABLE || ENVIRONMENT.NODE_ENV === NodeEnv.Local
      ? this.OTP_TESTING
      : randomNumber(this.OTP_LENGTH);
  }

  private getOtpKey(phoneNumber: string, behavior: VerificationBehavior) {
    return `${RedisKey.Otp}${behavior}_${phoneNumber}`;
  }

  async sendOtp(phoneNumber: string, behavior: VerificationBehavior) {
    let currentLimit = 0;
    const otpKey = this.getOtpKey(phoneNumber, behavior);
    const otpLimitKey = `${RedisKey.OtpLimit}${phoneNumber}`;
    try {
      const [lastSent, lastLimit] = await Promise.all([
        this.redis.get<string>(otpKey),
        this.redis.get<number>(otpLimitKey),
      ]);

      if (lastSent) throw new CustomError(ErrorCode.OptAlreadyExist);
      if (lastLimit && lastLimit >= this.OTP_LIMIT) throw new CustomError(ErrorCode.OtpSpam);

      const otp = this.generateOtp();
      const expireAt = moment().add({ seconds: this.OTP_EXPIRE_TIME }).unix();

      await Promise.all([
        this.redis.set(otpKey, otp, this.OTP_EXPIRE_TIME),
        this.redis.set(otpLimitKey, (lastLimit || 0) + 1, this.OTP_DAY_LIMIT),
      ]);

      currentLimit = (lastLimit || 0) + 1;

      await this.verificationLogRepository.insert({
        code: otp,
        expireAt,
        phoneNumber,
        verificationBehavior: behavior,
        verificationType: VerificationType.Otp,
      } as VerificationLog);

      await this.sms.sendSms({ to: phoneNumber, message: getSmsMessage(SmsCode.Otp, phoneNumber) });

      return expireAt;
    } catch (error) {
      // Revert cache data
      const prevLimit = currentLimit - 1;

      if (currentLimit)
        await Promise.all([
          this.redis.del(otpKey),
          prevLimit ? this.redis.set(otpLimitKey, prevLimit, this.OTP_DAY_LIMIT) : this.redis.del(otpLimitKey),
        ]);

      throw error;
    }
  }

  async confirmOtp(phoneNumber: string, inputOtp: string, behavior: VerificationBehavior) {
    try {
      const otpKey = this.getOtpKey(phoneNumber, behavior);

      const otp = await this.redis.get(otpKey);

      if (!otp) throw new CustomError(ErrorCode.OtpExpired);
      if (otp !== inputOtp) throw new CustomError(ErrorCode.OtpIncorrect);

      await this.verificationLogRepository.nativeUpdate(
        { phoneNumber, verificationBehavior: behavior, isActive: true },
        { isActive: false, confirmedAt: moment().unix() },
      );
    } catch (error) {
      throw error;
    }
  }
}
