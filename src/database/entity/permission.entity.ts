import { TextProperty } from "@core/decorator/field.decorator";
import { AccountPermission } from "@database/entity/account-permissions.entity";
import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "permissions" })
export class Permission {
  @PrimaryKey({ type: "text" })
  id!: string;

  @TextProperty()
  name: string;

  @Property()
  isActive = true;

  @OneToMany(() => AccountPermission, (ap) => ap.permission)
  accountPermissions = new Collection<AccountPermission>(this);
}
