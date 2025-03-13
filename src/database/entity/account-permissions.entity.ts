import { Account } from "@database/entity/account.entity";
import { BaseEntity } from "@database/entity/base-entity";
import { Permission } from "@database/entity/permission.entity";
import { Entity, ManyToOne, PrimaryKey } from "@mikro-orm/core";

@Entity({ tableName: "account_permissions" })
export class AccountPermission extends BaseEntity {
  @ManyToOne(() => Account, { fieldName: "account_id" })
  account!: Account;

  @ManyToOne(() => Permission, { fieldName: "permission_id" })
  permission!: Permission;
}
