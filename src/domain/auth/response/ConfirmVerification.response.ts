import { Account } from "@database/entity/account.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@shared/enum/role.enum";

export class ConfirmVerificationResponse {
  @ApiProperty({ example: 1 })
  id: string;
  @ApiProperty({ example: "Leon", required: false })
  name?: string;
  @ApiProperty({ example: "leon.tech@gmail.com" })
  email: string;
  @ApiProperty({ example: "01242885258", required: false })
  phoneNumber?: string;
  @ApiProperty({ enum: Role, example: `${Role.Member}` })
  role: Role;

  static fromEntity(account: Account): ConfirmVerificationResponse {
    return {
      id: account.id,
      role: account.role,
      email: account.email,
      name: account.name,
      phoneNumber: account.phoneNumber,
    };
  }
}
