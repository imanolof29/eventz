import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            const responseBody =
                typeof exceptionResponse === 'string'
                    ? { statusCode: status, message: exceptionResponse }
                    : {
                        statusCode: status,
                        message: exceptionResponse['message'] || exceptionResponse,
                        error: exception.message || 'Error',
                    };

            return response.status(status).json(responseBody);
        }

        response.status(status).json({
            statusCode: status,
            ...(typeof errorResponse === 'string' ? { message: errorResponse } : errorResponse),
        });
    }
}