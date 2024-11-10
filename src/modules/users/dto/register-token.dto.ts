import { ApiProperty } from "@nestjs/swagger";

export class RegisterTokenDto {
    @ApiProperty({
        example: 'APA91bH7y5FI87gQcJpYXvSdJHkL36PaSxvZ-9uL_M9xKfREs0UjcBdFqEElL_XN3iGnKzJ3m8SZbyY9TW5HQfFd1aZ1o3UlBTRa1OiYZBo4zQG35ZKfD29FsWQt8AY4kJp2LQ_l',
        description: 'FCM'
    })
    token: string
}