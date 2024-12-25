import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { error } from "console";
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof HttpException) {
            return response.status(status).json({
                statusCode: status,
                message: exception.getResponse(),
                error: exception.message,
            });
        }

        response.status(status).json({
            statusCode: status,
            message: 'We got an error in processing this request',
            error: 'Internal server error',
        });
    }
}
