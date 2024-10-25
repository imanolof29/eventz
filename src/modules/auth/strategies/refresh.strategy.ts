import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/modules/users/user.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {

    constructor(
        configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('REFRESH_SECRET')
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload

        const user = await this.userRepository.findOneBy({ id })

        if (!user) {
            throw new UnauthorizedException('Token not valid')
        }

        return user
    }

}