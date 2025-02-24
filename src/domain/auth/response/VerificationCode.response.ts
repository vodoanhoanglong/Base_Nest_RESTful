export class VerificationCodeResponse {
  waitSeconds: number;

  // OTP
  expireAt: number;

  static transformData(waitSeconds: number): Partial<VerificationCodeResponse> {
    return {
      waitSeconds,
    };
  }

  static transformOtpData(expireAt: number): Partial<VerificationCodeResponse> {
    return {
      expireAt,
    };
  }
}
