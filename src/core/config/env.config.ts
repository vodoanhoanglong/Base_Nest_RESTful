import { ConfigModuleOptions } from "@nestjs/config";
import { NodeEnv } from "@shared/enum/environment.enum";
import { convertStringToBool } from "@shared/helper/convert";
import { plainToInstance, Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from "class-validator";

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

  @Transform(({ value }) => convertStringToBool(value))
  @IsBoolean()
  @IsNotEmpty()
  DB_AUTO_SYNC: boolean;

  @IsString()
  @IsNotEmpty()
  CORS: string;

  @Transform(({ value }) => convertStringToBool(value))
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
  JWT_SENSITIVE_SECRET: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  JWT_EXPIRED: number;

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

  @Transform(({ value }) => convertStringToBool(value))
  @IsBoolean()
  @IsNotEmpty()
  SMS_ENABLE: boolean;

  @IsString()
  @IsNotEmpty()
  COOL_SMS_NUMBER: string;

  @IsString()
  @IsNotEmpty()
  COOL_SMS_KEY: string;

  @IsString()
  @IsNotEmpty()
  COOL_SMS_SECRET: string;

  @IsString()
  @IsNotEmpty()
  COOL_SMS_API_DOMAIN: string;

  @IsString()
  @IsOptional()
  COOL_SMS_KAKAO_PFID?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  OTP_EXPIRE_TIME: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  OTP_LENGTH: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  OTP_LIMIT: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  OTP_DAY_LIMIT: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  VERIFICATION_SESSION: number;
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
