import { HttpStatus } from "@nestjs/common";
import { ErrorCode } from "@shared/enum/error-code.enum";

export class BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  error?: unknown;
  errorCode?: ErrorCode;

  private constructor(statusCode: number, message: string, data: T | null, error?: unknown, errorCode?: ErrorCode) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
    this.errorCode = errorCode;
  }

  public static of<T>(data: T): BaseResponse<T> {
    return new BaseResponse<T>(HttpStatus.OK, "OK", data);
  }

  public static exception<T>(
    statusCode: number,
    errorCode: ErrorCode,
    errorMessage: string,
    error: unknown,
  ): BaseResponse<T> {
    return new BaseResponse<T>(statusCode, errorMessage, null, error, errorCode);
  }

  public static ok<T>(): BaseResponse<T> {
    return new BaseResponse<T>(HttpStatus.OK, "OK", null);
  }

  public static fault<T>(errorMessage: string, data: T) {
    return new BaseResponse<T>(HttpStatus.BAD_REQUEST, errorMessage, data, null);
  }
}
