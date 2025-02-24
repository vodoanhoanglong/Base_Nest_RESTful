import { REDIS_CLIENT } from "@core/config/redis.config";
import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private redis: Redis) {}

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttlSeconds) await this.redis.set(key, serializedValue, "EX", ttlSeconds);
    else await this.redis.set(key, serializedValue);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
