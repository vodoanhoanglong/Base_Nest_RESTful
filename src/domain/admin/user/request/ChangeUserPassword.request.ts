import { ApiProperty } from "@nestjs/swagger";
import { REGEX_USER_PASSWORD } from "@shared/constant/regex.constant";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ChangeUserPasswordRequest {
  @ApiProperty({ example: "Password@123456" })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(REGEX_USER_PASSWORD)
  password: string;
}
