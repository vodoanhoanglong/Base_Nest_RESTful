import { initEnvironmentConfig } from "@core/config/env.config";
import { AuthModule } from "@domain/auth/auth.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { initOrmConfig } from "src/core/config/orm.config";

@Module({
  imports: [ConfigModule.forRoot(initEnvironmentConfig()), MikroOrmModule.forRoot(initOrmConfig()), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
