import { SmsCode } from "@shared/enum/sms-code.enum";

const SmsMessage: Record<SmsCode, string | ((param: string | number) => string)> = {
  [SmsCode.Otp]: (otp: string) => `Aroma Chemi, your register code is ${otp}`,
} as const;

export function getSmsMessage(code: SmsCode, param?: string | number): string {
  const message = SmsMessage[code];
  return typeof message === "function" ? message(param ?? "") : message;
}
