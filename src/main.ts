import { ENVIRONMENT } from "@core/config/env.config";
import { UnhandledExceptionFilter } from "@core/exception/exception.filter";
import { JwtAuthGuard } from "@core/guard/jwt-auth.guard";
import { HttpLoggerInterceptor } from "@core/interceptor/http-logger.interceptor";
import { CustomValidationPipe } from "@core/pipe/validation.pipe";
import { MikroORM } from "@mikro-orm/core";
import { VersioningType } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { WinstonLogger } from "@shared/service/logger/winston.logger";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { WinstonModule } from "nest-winston";
import { AppModule } from "src/app.module";

/**
 * Essential configs
 *
 * @property logger: Custom logger with Winston package.
 * @property cors: Allow resources to be requested from another domain
 *
 * @package helmet: Protect vulnerabilities.
 * @package compression: Compression response to optimize, have issue with SSE.
 * @package cookieParser: Track state of user.
 * @package bodyParser: Config further options for payload.
 *
 * @module useGlobalPipes: Handle the input data.
 * @module useGlobalFilters: Catch all the unhandled exceptions.
 * @module useGlobalInterceptors: Wrap up the request and response stream entire application.
 * @module useGlobalGuards: Authenticate by JwtStrategy -> Authorize by `Roles` decorator.
 *
 * @version enableVersioning: Versioning API default prefixed with 'v' character.
 */
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger({ instance: WinstonLogger }),
      cors: {
        origin: ENVIRONMENT.CORS,
        credentials: ENVIRONMENT.CORS_CREDENTIALS,
      },
    });

    app.use(helmet());
    app.use(compression());
    app.use(cookieParser(ENVIRONMENT.COOKIE_SECRET));
    app.use(bodyParser.json({ limit: "1mb" }));
    app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

    app.useGlobalPipes(new CustomValidationPipe());
    app.useGlobalFilters(new UnhandledExceptionFilter());
    app.useGlobalInterceptors(new HttpLoggerInterceptor());
    app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
    app.enableVersioning({
      type: VersioningType.URI,
    });

    if (ENVIRONMENT.DB_AUTO_SYNC) await app.get(MikroORM).getSchemaGenerator().updateSchema();

    await app.listen(ENVIRONMENT.PORT);
    WinstonLogger.info(`✅ Server ready at http://localhost:${ENVIRONMENT.PORT}`);
  } catch (error) {
    WinstonLogger.error(`❌ Error while starting server, ${error}`);
    process.exit();
  }
}

bootstrap();
