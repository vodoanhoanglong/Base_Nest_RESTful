import { Migration } from '@mikro-orm/migrations';

export class Migration20250225123103 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "verification_logs" add column "verification_behavior" text check ("verification_behavior" in ('find_email', 'reset_password', 'register_account')) not null default 'register_account';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "verification_logs" drop column "verification_behavior";`);
  }

}
