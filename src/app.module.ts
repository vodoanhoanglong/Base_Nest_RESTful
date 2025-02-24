import { initEnvironmentConfig } from "@core/config/env.config";
import { UserModule } from "@domain/admin/user/user.module";
import { AuthModule } from "@domain/auth/auth.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "@shared/service/redis/redis.module";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { initOrmConfig } from "src/core/config/orm.config";

@Module({
  imports: [
    ConfigModule.forRoot(initEnvironmentConfig()),
    MikroOrmModule.forRoot(initOrmConfig()),
    RedisModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
