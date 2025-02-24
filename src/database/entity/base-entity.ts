import { Account } from "@database/entity/account.entity";
import { ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

export abstract class BaseEntity {
  @PrimaryKey({ type: "bigint" })
  id!: string;

  @Property()
  isActive = true;

  @Property({ defaultRaw: "EXTRACT(EPOCH FROM NOW())" })
  createdAt: number;

  @Property({ onUpdate: () => "EXTRACT(EPOCH FROM NOW())", nullable: true })
  updatedAt?: number;

  @ManyToOne({ entity: () => Account, fieldName: "created_by", nullable: true })
  creator?: Account;

  @ManyToOne({ entity: () => Account, fieldName: "updated_by", nullable: true })
  updater?: Account;
}
