import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { VerificationBehavior, VerificationType } from "@shared/enum/verification.enum";
import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class SendVerificationRequest {
  @ValidateIf((o) => o.verificationType === VerificationType.Otp)
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: `Require if verification method is \`${VerificationType.Otp}\`` })
  phoneNumber?: string;

  @ValidateIf((o) => o.verificationType === VerificationType.Email)
  @IsEmail()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: `Require if verification method is \`${VerificationType.Email}\`` })
  email?: string;

  @IsNotEmpty()
  @IsEnum(VerificationBehavior)
  @ApiProperty({
    enum: VerificationBehavior,
    description: "Verification behavior",
    example: VerificationBehavior.FindEmail,
  })
  verificationBehavior: VerificationBehavior;

  @IsNotEmpty()
  @IsEnum(VerificationType)
  @ApiProperty({ enum: VerificationType, description: "Verification method", example: VerificationType.Otp })
  verificationType: VerificationType;
}
