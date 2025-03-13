import { AccountPermission } from "@database/entity/account-permissions.entity";
import { Account } from "@database/entity/account.entity";
import { SignInResponse } from "@domain/auth/response/SignIn.response";
import { ApiProperty } from "@nestjs/swagger";

class PermissionResponse {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class PortalSignInResponse extends SignInResponse {
  @ApiProperty({
    example: [
      {
        id: "user-mngt",
        name: "User Management",
      },
    ],
  })
  permissions: PermissionResponse[];

  static fromEntity(account: Account, accessToken: string, refreshToken: string): PortalSignInResponse {
    return {
      id: account.id,
      role: account.role,
      accessToken,
      refreshToken,
      permissions: account.accountPermissions
        .getItems()
        .map((ap: AccountPermission) => new PermissionResponse(ap.permission.id, ap.permission.name)),
    };
  }
}
