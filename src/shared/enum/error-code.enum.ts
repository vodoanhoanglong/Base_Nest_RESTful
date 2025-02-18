export enum ErrorCode {
  ValidationFailed = "validation_failed",
  Unauthenticated = "unauthenticated",
  Unauthorized = "unauthorized",
  ExistedEmail = "existed_email",
  InvalidEmailOrPassword = "invalid_email_or_password",

  MissingMigrationFilename = "missing_migration_filename",

  UnknownError = "unknown_error",
}
