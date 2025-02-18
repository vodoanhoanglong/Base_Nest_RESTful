export class BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  error?: unknown;

  private constructor(statusCode: number, message: string, data: T | null, error?: unknown) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  public static of<T>(data: T): BaseResponse<T> {
    return new BaseResponse<T>(200, "OK", data);
  }

  public static error<T>(statusCode: number, errorMessage: string, error: unknown): BaseResponse<T> {
    return new BaseResponse<T>(statusCode, errorMessage, null, error);
  }

  public static ok<T>(): BaseResponse<T> {
    return new BaseResponse<T>(200, "OK", null);
  }
}
