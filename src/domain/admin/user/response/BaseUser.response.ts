import { Account } from "@database/entity/account.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@shared/enum/role.enum";

export class BaseUsersResponse {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: "User 123" })
  name: string | null;

  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "0123456789" })
  phoneNumber: string | null;

  @ApiProperty({ example: 1740106575 })
  createdAt: number | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ enum: Role, example: `${Role.Member}` })
  role: Role;

  static fromEntity(account: Account): BaseUsersResponse {
    return {
      id: account.id,
      name: account.name ?? null,
      email: account.email,
      phoneNumber: account.phoneNumber ?? null,
      createdAt: account.createdAt ?? null,
      isActive: account.isActive,
      role: account.role,
    };
  }
}
