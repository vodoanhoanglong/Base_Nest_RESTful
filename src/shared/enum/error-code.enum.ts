export enum ErrorCode {
  ValidationFailed = "validation_failed",
  Unauthenticated = "unauthenticated",
  Unauthorized = "unauthorized",
  TokenExpired = "token_expired",
  ExistedEmail = "existed_email",
  InvalidEmailOrPassword = "invalid_email_or_password",

  // Account
  AccountNotFound = "account_not_found",

  // Token
  InvalidToken = "invalid_token",
  InvalidTokenSecret = "invalid_token_secret",
  InvalidDecodeToken = "invalid_decode_token",
  InvalidTokenIssuer = "invalid_token_issuer",

  // Database
  DatabaseError = "database_error",

  // User
  UserNotFound = "user_not_found",

  MissingMigrationFilename = "missing_migration_filename",

  // Auth verification
  SendSmsFailed = "send_sms_failed",
  InvalidVerificationType = "invalid_verification_type",
  OptAlreadyExist = "otp_already_exist",
  OtpSpam = "otp_spam",
  OtpExpired = "otp_expired",
  OtpIncorrect = "otp_incorrect",
  VerificationNotFound = "verification_not_found",
  VerificationSessionExpired = "verification_session_expired",

  // Mail
  NotAnyRecipient = "not_any_recipient",
  SendMailFailed = "send_mail_failed",

  // Queue
  ConsumerNotFound = "consumer_not_found",
  ProcessFailed = "process_failed",
  ConsumerFailed = "consumer_failed",

  HttpError = "http_error",
  UnknownError = "unknown_error",
}

const ErrorCodeSet = new Set(Object.values(ErrorCode));
export const isErrorCode = (value: string): value is ErrorCode => ErrorCodeSet.has(value as ErrorCode);
