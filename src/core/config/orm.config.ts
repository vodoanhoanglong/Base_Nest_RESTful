import { ENVIRONMENT } from "@core/config/env.config";
import { defineConfig, ReflectMetadataProvider } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { NodeEnv } from "@shared/enum/environment.enum";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { CustomError } from "@shared/helper/error";
import { WinstonLogger } from "@shared/service/logger/winston.logger";

export const initOrmConfig = () =>
  defineConfig({
    host: ENVIRONMENT.DB_HOST,
    port: ENVIRONMENT.DB_PORT,
    user: ENVIRONMENT.DB_USERNAME,
    password: ENVIRONMENT.DB_PASSWORD,
    dbName: ENVIRONMENT.DB_NAME,

    autoJoinOneToOneOwner: false,
    migrations: {
      fileName: (timestamp: string, name?: string) => {
        if (!name) throw new CustomError(ErrorCode.MissingMigrationFilename);
        return `${timestamp}_${name}`;
      },
    },

    ...(ENVIRONMENT.NODE_ENV === NodeEnv.Local
      ? {
          debug: true,
          highlighter: new SqlHighlighter(),
          logger: (message) => WinstonLogger.debug(message),
          metadataProvider: TsMorphMetadataProvider,
        }
      : {
          debug: false,
          metadataProvider: ReflectMetadataProvider,
        }),
  });
