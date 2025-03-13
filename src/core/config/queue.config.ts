import { ENVIRONMENT } from "@core/config/env.config";
import { QueueOptions } from "bullmq";

export const initQueueConfig = (): QueueOptions => ({
  connection: {
    host: ENVIRONMENT.REDIS_HOST,
    port: ENVIRONMENT.REDIS_PORT,
  },
});
