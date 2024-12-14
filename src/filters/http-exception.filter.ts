import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        response.status(status).json({
            statusCode: status,
            ...(typeof errorResponse === 'string' ? { message: errorResponse } : errorResponse),
        });
    }
}
