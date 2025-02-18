import { Migration } from '@mikro-orm/migrations';

export class Migration20250217155548 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "accounts" ("id" bigserial primary key, "is_active" boolean not null default true, "created_at" int not null default EXTRACT(EPOCH FROM NOW()), "updated_at" int not null, "created_by" bigint not null, "updated_by" bigint not null, "name" text null, "email" text not null, "phone_number" text null, "password" text not null, "role" smallint not null);`);

    this.addSql(`alter table "accounts" add constraint "accounts_created_by_foreign" foreign key ("created_by") references "accounts" ("id") on update cascade;`);
    this.addSql(`alter table "accounts" add constraint "accounts_updated_by_foreign" foreign key ("updated_by") references "accounts" ("id") on update cascade;`);
  }

}
