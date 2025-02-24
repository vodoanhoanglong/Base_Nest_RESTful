import { VerificationType } from "@shared/enum/verification.enum";
import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class SendVerificationRequest {
  @ValidateIf((o) => o.verificationType === VerificationType.Otp)
  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;

  @ValidateIf((o) => o.verificationType === VerificationType.Email)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  @IsEnum(VerificationType)
  verificationType: VerificationType;
}
