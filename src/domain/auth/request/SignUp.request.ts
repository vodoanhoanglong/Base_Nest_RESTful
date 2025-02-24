import { Account } from "@database/entity/account.entity";
import { REGEX_USER_PASSWORD } from "@shared/constant/regex.constant";
import { Role } from "@shared/enum/role.enum";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignUpRequest {
  @Transform(({ value }) => typeof value === "string" && value.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(REGEX_USER_PASSWORD)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
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
