import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInRequest {
  @ApiProperty({ example: "user@example.com" })
  @Transform(({ value }) => typeof value === "string" && value.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "Password@123456" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
