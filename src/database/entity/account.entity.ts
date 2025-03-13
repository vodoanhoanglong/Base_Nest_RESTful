import { TextProperty } from "@core/decorator/field.decorator";
import { AccountPermission } from "@database/entity/account-permissions.entity";
import { BaseEntity } from "@database/entity/base-entity";
import { Collection, Entity, Enum, OneToMany } from "@mikro-orm/core";
import { Role } from "@shared/enum/role.enum";

@Entity({ tableName: "accounts" })
export class Account extends BaseEntity {
  @TextProperty({ nullable: true })
  name?: string;

  @TextProperty()
  email: string;

  @TextProperty({ nullable: true })
  phoneNumber?: string;

  @TextProperty()
  password: string;

  @Enum({ items: () => Role })
  role: Role;

  @OneToMany(() => AccountPermission, (ap) => ap.account)
  accountPermissions = new Collection<AccountPermission>(this);
}
