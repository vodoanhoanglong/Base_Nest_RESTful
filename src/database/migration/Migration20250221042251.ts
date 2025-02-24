import { Migration } from '@mikro-orm/migrations';

export class Migration20250221042251 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "accounts" drop constraint "accounts_created_by_foreign";`);
    this.addSql(`alter table "accounts" drop constraint "accounts_updated_by_foreign";`);

    this.addSql(`alter table "verification_logs" drop constraint "verification_logs_account_id_foreign";`);
    this.addSql(`alter table "verification_logs" drop constraint "verification_logs_created_by_foreign";`);
    this.addSql(`alter table "verification_logs" drop constraint "verification_logs_updated_by_foreign";`);

    this.addSql(`alter table "accounts" alter column "updated_at" type int using ("updated_at"::int);`);
    this.addSql(`alter table "accounts" alter column "updated_at" drop not null;`);
    this.addSql(`alter table "accounts" alter column "created_by" type bigint using ("created_by"::bigint);`);
    this.addSql(`alter table "accounts" alter column "created_by" drop not null;`);
    this.addSql(`alter table "accounts" alter column "updated_by" type bigint using ("updated_by"::bigint);`);
    this.addSql(`alter table "accounts" alter column "updated_by" drop not null;`);
    this.addSql(`alter table "accounts" add constraint "accounts_created_by_foreign" foreign key ("created_by") references "accounts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "accounts" add constraint "accounts_updated_by_foreign" foreign key ("updated_by") references "accounts" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "verification_logs" alter column "updated_at" type int using ("updated_at"::int);`);
    this.addSql(`alter table "verification_logs" alter column "updated_at" drop not null;`);
    this.addSql(`alter table "verification_logs" alter column "created_by" type bigint using ("created_by"::bigint);`);
    this.addSql(`alter table "verification_logs" alter column "created_by" drop not null;`);
    this.addSql(`alter table "verification_logs" alter column "updated_by" type bigint using ("updated_by"::bigint);`);
    this.addSql(`alter table "verification_logs" alter column "updated_by" drop not null;`);
    this.addSql(`alter table "verification_logs" alter column "confirmed_at" type int using ("confirmed_at"::int);`);
    this.addSql(`alter table "verification_logs" alter column "confirmed_at" drop not null;`);
    this.addSql(`alter table "verification_logs" alter column "email" type varchar(255) using ("email"::varchar(255));`);
    this.addSql(`alter table "verification_logs" alter column "email" drop not null;`);
    this.addSql(`alter table "verification_logs" alter column "phone_number" type varchar(255) using ("phone_number"::varchar(255));`);
    this.addSql(`alter table "verification_logs" alter column "phone_number" drop not null;`);
    this.addSql(`alter table "verification_logs" alter column "account_id" type bigint using ("account_id"::bigint);`);
    this.addSql(`alter table "verification_logs" alter column "account_id" drop not null;`);
    this.addSql(`alter table "verification_logs" add constraint "verification_logs_account_id_foreign" foreign key ("account_id") references "accounts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "verification_logs" add constraint "verification_logs_created_by_foreign" foreign key ("created_by") references "accounts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "verification_logs" add constraint "verification_logs_updated_by_foreign" foreign key ("updated_by") references "accounts" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "accounts" drop constraint "accounts_created_by_foreign";`);
    this.addSql(`alter table "accounts" drop constraint "accounts_updated_by_foreign";`);

    this.addSql(`alter table "verification_logs" drop constraint "verification_logs_created_by_foreign";`);
    this.addSql(`alter table "verification_logs" drop constraint "verification_logs_updated_by_foreign";`);
    this.addSql(`alter table "verification_logs" drop constraint "verification_logs_account_id_foreign";`);

    this.addSql(`alter table "accounts" alter column "updated_at" type int4 using ("updated_at"::int4);`);
    this.addSql(`alter table "accounts" alter column "updated_at" set not null;`);
    this.addSql(`alter table "accounts" alter column "created_by" type int8 using ("created_by"::int8);`);
    this.addSql(`alter table "accounts" alter column "created_by" set not null;`);
    this.addSql(`alter table "accounts" alter column "updated_by" type int8 using ("updated_by"::int8);`);
    this.addSql(`alter table "accounts" alter column "updated_by" set not null;`);
    this.addSql(`alter table "accounts" add constraint "accounts_created_by_foreign" foreign key ("created_by") references "accounts" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "accounts" add constraint "accounts_updated_by_foreign" foreign key ("updated_by") references "accounts" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "verification_logs" alter column "updated_at" type int4 using ("updated_at"::int4);`);
    this.addSql(`alter table "verification_logs" alter column "updated_at" set not null;`);
    this.addSql(`alter table "verification_logs" alter column "created_by" type int8 using ("created_by"::int8);`);
    this.addSql(`alter table "verification_logs" alter column "created_by" set not null;`);
    this.addSql(`alter table "verification_logs" alter column "updated_by" type int8 using ("updated_by"::int8);`);
    this.addSql(`alter table "verification_logs" alter column "updated_by" set not null;`);
    this.addSql(`alter table "verification_logs" alter column "confirmed_at" type int4 using ("confirmed_at"::int4);`);
    this.addSql(`alter table "verification_logs" alter column "confirmed_at" set not null;`);
    this.addSql(`alter table "verification_logs" alter column "email" type varchar(255) using ("email"::varchar(255));`);
    this.addSql(`alter table "verification_logs" alter column "email" set not null;`);
    this.addSql(`alter table "verification_logs" alter column "phone_number" type varchar(255) using ("phone_number"::varchar(255));`);
    this.addSql(`alter table "verification_logs" alter column "phone_number" set not null;`);
    this.addSql(`alter table "verification_logs" alter column "account_id" type int8 using ("account_id"::int8);`);
    this.addSql(`alter table "verification_logs" alter column "account_id" set not null;`);
    this.addSql(`alter table "verification_logs" add constraint "verification_logs_created_by_foreign" foreign key ("created_by") references "accounts" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "verification_logs" add constraint "verification_logs_updated_by_foreign" foreign key ("updated_by") references "accounts" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "verification_logs" add constraint "verification_logs_account_id_foreign" foreign key ("account_id") references "accounts" ("id") on update cascade on delete no action;`);
  }

}
