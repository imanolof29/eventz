import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  imports: [
    JwtModule.register({
      secret: '',
      signOptions: { expiresIn: '2d' },
    }),
  ]
})
export class AuthModule { }
