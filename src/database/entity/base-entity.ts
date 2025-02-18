import { Account } from "@database/entity/account.entity";
import { ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey({ type: "bigint" })
  id!: string;

  @Property()
  isActive = true;

  @Property({ defaultRaw: "EXTRACT(EPOCH FROM NOW())" })
  createdAt?: number;

  @Property({ onUpdate: () => "EXTRACT(EPOCH FROM NOW())" })
  updatedAt?: number;

  @ManyToOne({ entity: () => Account, fieldName: "created_by" })
  creator?: Account;

  @ManyToOne({ entity: () => Account, fieldName: "updated_by" })
  updater?: Account;
}
