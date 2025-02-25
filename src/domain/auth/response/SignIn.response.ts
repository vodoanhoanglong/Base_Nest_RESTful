import { Account } from "@database/entity/account.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@shared/enum/role.enum";

export class SignInResponse {
  @ApiProperty({ example: 1 })
  id: string;
  @ApiProperty({ enum: Role, example: `${Role.Member}` })
  role: Role;
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  accessToken: string;
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  refreshToken: string;

  static fromEntity(account: Account, accessToken: string, refreshToken: string): SignInResponse {
    return {
      id: account.id,
      role: account.role,
      accessToken,
      refreshToken,
    };
  }
}
