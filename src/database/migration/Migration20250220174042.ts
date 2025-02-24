import { Migration } from '@mikro-orm/migrations';

export class Migration20250220174042 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "accounts" ("id" bigserial primary key, "is_active" boolean not null default true, "created_at" int not null default EXTRACT(EPOCH FROM NOW()), "updated_at" int not null, "created_by" bigint not null, "updated_by" bigint not null, "name" text null, "email" text not null, "phone_number" text null, "password" text not null, "role" text check ("role" in ('admin', 'moderator', 'member')) not null);`);

    this.addSql(`create table "verification_logs" ("id" bigserial primary key, "is_active" boolean not null default true, "created_at" int not null default EXTRACT(EPOCH FROM NOW()), "updated_at" int not null, "created_by" bigint not null, "updated_by" bigint not null, "code" varchar(255) not null, "verification_type" text check ("verification_type" in ('otp', 'email')) not null, "expire_at" int not null, "confirmed_at" int not null, "email" varchar(255) not null, "phone_number" varchar(255) not null, "account_id" bigint not null);`);

    this.addSql(`alter table "accounts" add constraint "accounts_created_by_foreign" foreign key ("created_by") references "accounts" ("id") on update cascade;`);
    this.addSql(`alter table "accounts" add constraint "accounts_updated_by_foreign" foreign key ("updated_by") references "accounts" ("id") on update cascade;`);

    this.addSql(`alter table "verification_logs" add constraint "verification_logs_created_by_foreign" foreign key ("created_by") references "accounts" ("id") on update cascade;`);
    this.addSql(`alter table "verification_logs" add constraint "verification_logs_updated_by_foreign" foreign key ("updated_by") references "accounts" ("id") on update cascade;`);
    this.addSql(`alter table "verification_logs" add constraint "verification_logs_account_id_foreign" foreign key ("account_id") references "accounts" ("id") on update cascade;`);
  }

}
