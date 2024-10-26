import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { OPTIONAL_INT_PIPE_NUMBER } from "src/errors/errors.constants";

@Injectable()
export class OptionalIntPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value == null) return undefined
        const num = Number(value)
        if (isNaN(num))
            throw new BadRequestException(
                OPTIONAL_INT_PIPE_NUMBER.replace('$key', metadata.data),
            )
        return num
    }
}