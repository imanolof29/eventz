import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { User } from "src/modules/users/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('CLIENT_SECRET'),
            callbackURL: configService.get('CALLBACK_URL'),
            scope: ['profile', 'email']
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {

        const { id, name, emails, photos } = profile
        console.log(accessToken)
        console.log(refreshToken)
        console.log(profile)
        const user = {
            provider: 'google',
            providerId: id,
            emails: emails[0].value,
            name: name.givenName,
            picture: photos[0].value
        }

        done(null, user)
    }

}