import { Account } from "@database/entity/account.entity";
import { ApiProperty } from "@nestjs/swagger";
import { REGEX_USER_PASSWORD } from "@shared/constant/regex.constant";
import { Role } from "@shared/enum/role.enum";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignUpRequest {
  @Transform(({ value }) => typeof value === "string" && value.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(REGEX_USER_PASSWORD)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  static toCreateInput(request: SignUpRequest, hashedPassword: string) {
    return {
      name: request.name,
      email: request.email,
      password: hashedPassword,
      phoneNumber: request.phoneNumber,
      role: Role.Member,
    } as Account;
  }
}
