import { Account } from "@database/entity/account.entity";
import { Role } from "@shared/enum/role.enum";

export class SignInResponse {
  id: string;
  role: Role;
  accessToken: string;
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
