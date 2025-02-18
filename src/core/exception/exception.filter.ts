import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { getErrorMessage } from "@shared/constant/error-message.constant";
import { ErrorCode } from "@shared/enum/error-code.enum";
import { BaseResponse } from "@shared/helper/response";
import { IException } from "@shared/interface/exception.interface";
import { WinstonLogger } from "@shared/service/logger/winston.logger";
import chalk from "chalk";
import * as moment from "moment";

@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
  /* TODO: Send entire exceptions to the log service on cloud */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception instanceof Error
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: IException = {
      statusCode: status,
      message: this.getExceptionMessage(exception),
      method: request.method,
      path: request.url,
      timestamp: moment().toISOString(),
      exception,
    };

    WinstonLogger.error(`${chalk.redBright(UnhandledExceptionFilter.name)}`, { metadata: errorResponse });
    response
      .status(status)
      .json(BaseResponse.error(errorResponse.statusCode, errorResponse.message, errorResponse.exception));
  }

  private getExceptionMessage(exception: unknown): string {
    if (exception instanceof Error) return exception.message;
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === "string") return response;
      if (typeof response === "object" && "message" in response) return response.message as string;
    }

    return getErrorMessage(ErrorCode.UnknownError);
  }
}
