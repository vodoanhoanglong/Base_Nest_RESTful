import { Migration } from '@mikro-orm/migrations';

export class Migration20250303025836 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "permissions" ("id" text not null, "name" text not null, "is_active" boolean not null default true, constraint "permissions_pkey" primary key ("id"));`);

    this.addSql(`create table "account_permissions" ("id" bigserial primary key, "is_active" boolean not null default true, "created_at" int not null default EXTRACT(EPOCH FROM NOW()), "updated_at" int null, "created_by" bigint null, "updated_by" bigint null, "account_id" bigint not null, "permission_id" text not null);`);

    this.addSql(`alter table "account_permissions" add constraint "account_permissions_created_by_foreign" foreign key ("created_by") references "accounts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "account_permissions" add constraint "account_permissions_updated_by_foreign" foreign key ("updated_by") references "accounts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "account_permissions" add constraint "account_permissions_account_id_foreign" foreign key ("account_id") references "accounts" ("id") on update cascade;`);
    this.addSql(`alter table "account_permissions" add constraint "account_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on update cascade;`);

    this.addSql(`alter table "accounts" drop constraint if exists "accounts_role_check";`);

    this.addSql(`alter table "accounts" alter column "created_at" type int using ("created_at"::int);`);
    this.addSql(`alter table "accounts" alter column "created_at" set not null;`);
    this.addSql(`alter table "accounts" add constraint "accounts_role_check" check("role" in ('admin', 'moderator', 'member'));`);

    this.addSql(`alter table "verification_logs" alter column "created_at" type int using ("created_at"::int);`);
    this.addSql(`alter table "verification_logs" alter column "created_at" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "account_permissions" drop constraint "account_permissions_permission_id_foreign";`);

    this.addSql(`drop table if exists "permissions" cascade;`);

    this.addSql(`drop table if exists "account_permissions" cascade;`);

    this.addSql(`alter table "accounts" drop constraint if exists "accounts_role_check";`);

    this.addSql(`alter table "accounts" alter column "created_at" type int4 using ("created_at"::int4);`);
    this.addSql(`alter table "accounts" alter column "created_at" drop not null;`);
    this.addSql(`alter table "accounts" add constraint "accounts_role_check" check("role" in ('admin', 'moderator', 'coach', 'member', 'anonymous'));`);

    this.addSql(`alter table "verification_logs" alter column "created_at" type int4 using ("created_at"::int4);`);
    this.addSql(`alter table "verification_logs" alter column "created_at" drop not null;`);
  }

}
