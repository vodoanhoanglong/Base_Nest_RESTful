import { ENVIRONMENT } from "@core/config/env.config";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { redisStore } from "cache-manager-redis-store";
import { RedisService } from "./redis.service";

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: ENVIRONMENT.REDIS_HOST,
            port: ENVIRONMENT.REDIS_PORT,
          },
          ttl: ENVIRONMENT.REDIS_TTL,
        }),
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
