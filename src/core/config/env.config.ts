import { ConfigModuleOptions } from "@nestjs/config";
import { NodeEnv } from "@shared/enum/environment.enum";
import { plainToInstance, Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from "class-validator";

class EnvironmentVariable {
  @IsEnum(NodeEnv)
  @IsNotEmpty()
  NODE_ENV: NodeEnv;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @Transform(({ value }) => value && Boolean(value))
  @IsBoolean()
  @IsNotEmpty()
  DB_AUTO_SYNC: boolean;

  @IsString()
  @IsNotEmpty()
  CORS: string;

  @Transform(({ value }) => value && Boolean(value))
  @IsBoolean()
  @IsNotEmpty()
  CORS_CREDENTIALS: boolean;

  @IsString()
  @IsNotEmpty()
  TIME_ZONE: string;

  @IsString()
  @IsNotEmpty()
  COOKIE_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRED: string;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  REDIS_PORT: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  REDIS_TTL: number;
}

export const ENVIRONMENT = {} as EnvironmentVariable;

function initEnvironmentVariable(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariable, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    let errorMessage = errors.map((message) => message.constraints?.[Object.keys(message.constraints)[0]]).join("\n");

    const color = {
      reset: "\x1b[0m",
      bright: "\x1b[1m",
      fgRed: "\x1b[31m",
    };

    errorMessage = `${color.fgRed}${color.bright}${errorMessage}${color.reset}`;
    throw new Error(errorMessage);
  }

  Object.assign(ENVIRONMENT, validatedConfig);
  return validatedConfig;
}

export const initEnvironmentConfig = () =>
  ({
    cache: true,
    isGlobal: true,
    expandVariables: true,
    validate: initEnvironmentVariable,
  }) as ConfigModuleOptions;
