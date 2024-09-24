import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private prisma: PrismaService, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwtRefreshSecret'),
        });
    }

    async validate(payload: JwtPayload) {
        const { id } = payload
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })
        if (!user) {
            throw new UnauthorizedException('Refresh token not valid')
        }
        return user
    }

}