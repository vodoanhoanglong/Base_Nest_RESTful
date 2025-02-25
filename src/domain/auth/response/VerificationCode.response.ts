import { ApiProperty } from "@nestjs/swagger";

export class VerificationCodeResponse {
  waitSeconds: number;

  // OTP
  @ApiProperty({ description: "Expired at verification", example: 1740412406898 })
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
