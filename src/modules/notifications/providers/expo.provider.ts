import { ConfigService } from "@nestjs/config";

export const expoProvider = {
    provide: 'EXPO_APP',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return {
            accessToken: configService.get<string>('EXPO_APP')
        }
    }
}