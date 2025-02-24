import { Account } from "@database/entity/account.entity";
import { BaseEntity } from "@database/entity/base-entity";
import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { VerificationType } from "@shared/enum/verification.enum";

@Entity({ tableName: "verification_logs" })
export class VerificationLog extends BaseEntity {
  @Property()
  code: string;

  @Enum({ items: () => VerificationType })
  verificationType: VerificationType;

  @Property()
  expireAt: number;

  @Property({ nullable: true })
  confirmedAt: number;

  @Property({ nullable: true })
  email?: string;

  @Property({ nullable: true })
  phoneNumber?: string;

  @ManyToOne({ nullable: true })
  account?: Account;
}
