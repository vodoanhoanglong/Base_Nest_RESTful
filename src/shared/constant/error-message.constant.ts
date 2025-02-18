import { ErrorCode } from "@shared/enum/error-code.enum";

const ErrorMessage: Record<ErrorCode, string | ((param: string) => string)> = {
  [ErrorCode.MissingMigrationFilename]: "Specify migration name via `mikro-orm migration:create --name=...`",
  [ErrorCode.Unauthorized]: (param) => `User role: ${param} is not allowed`,
  [ErrorCode.ValidationFailed]: "Validation failed",
  [ErrorCode.Unauthenticated]: "User not authenticated",
  [ErrorCode.ExistedEmail]: "Email already existed in system",
  [ErrorCode.InvalidEmailOrPassword]: "Email or password is invalid",

  [ErrorCode.UnknownError]: "Unknown error",
} as const;

export function getErrorMessage(code: ErrorCode, param?: string): string {
  const message = ErrorMessage[code];
  return typeof message === "function" ? message(param ?? "") : message;
}
