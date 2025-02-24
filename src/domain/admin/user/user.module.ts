import { Account } from "@database/entity/account.entity";
import { UserController } from "@domain/admin/user/user.controller";
import { UserService } from "@domain/admin/user/user.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

@Module({
  imports: [MikroOrmModule.forFeature([Account])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
