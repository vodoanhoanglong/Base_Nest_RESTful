import { Account } from "@database/entity/account.entity";
import { Role } from "@shared/enum/role.enum";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class SignUpRequest {
  @Transform(({ value }) => typeof value === "string" && value.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  static toCreateInput(request: SignUpRequest, hashedPassword: string) {
    return {
      email: request.email,
      phoneNumber: request.phoneNumber,
      name: request.name,
      password: hashedPassword,
      role: Role.Member,
    } as Account;
  }
}
