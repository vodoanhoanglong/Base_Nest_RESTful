import { ApiProperty } from "@nestjs/swagger";
import { REGEX_USER_PASSWORD } from "@shared/constant/regex.constant";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ResetPasswordRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(REGEX_USER_PASSWORD)
  @ApiProperty({ description: "Your new password" })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;
}
