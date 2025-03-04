import { ErrorCode } from "@shared/enum/error-code.enum";

const ErrorMessage: Record<ErrorCode, string | ((...param: unknown[]) => string)> = {
  [ErrorCode.DatabaseError]: "Database error",
  [ErrorCode.MissingMigrationFilename]: "Specify migration name via `mikro-orm migration:create --name=...`",

  [ErrorCode.Unauthorized]: (param) => `User role: ${param} is not allowed`,
  [ErrorCode.ValidationFailed]: "Validation failed",
  [ErrorCode.Unauthenticated]: "User not authenticated",
  [ErrorCode.ExistedEmail]: "Email already existed in system",
  [ErrorCode.InvalidEmailOrPassword]: "Email or password is invalid",
  [ErrorCode.TokenExpired]: "Token expired",

  [ErrorCode.AccountNotFound]: (identify: string) => `Account ${identify} not found in system`,

  [ErrorCode.InvalidToken]: "Invalid token",
  [ErrorCode.InvalidTokenSecret]: "Invalid token secret",
  [ErrorCode.InvalidDecodeToken]: "Invalid decoded token",
  [ErrorCode.InvalidTokenIssuer]: "Invalid token issuer",

  [ErrorCode.InvalidVerificationType]: "Verification type is invalid",
  [ErrorCode.SendSmsFailed]: (phone) => `Send sms to ${phone} failed`,
  [ErrorCode.OptAlreadyExist]: "Please wait before requesting a new OTP",
  [ErrorCode.OtpSpam]: "Reach out of limit otp send today",
  [ErrorCode.OtpExpired]: "OTP expired or invalid",
  [ErrorCode.OtpIncorrect]: "Incorrect OTP",

  [ErrorCode.VerificationNotFound]: "Please verification code earlier",
  [ErrorCode.VerificationSessionExpired]: "Your verification session is expired, please verify again",

  [ErrorCode.HttpError]: "Http request error",
  [ErrorCode.UnknownError]: "Unknown error",
} as const;

export function getErrorMessage(code: ErrorCode, ...param: unknown[]): string {
  const message = ErrorMessage[code];
  return typeof message === "function" ? message(...param) : message;
}
