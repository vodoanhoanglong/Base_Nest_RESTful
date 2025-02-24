import { Account } from "@database/entity/account.entity";
import { Role } from "@shared/enum/role.enum";

export class BaseUsersResponse {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  createdAt: number | null;
  isActive: boolean;
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
