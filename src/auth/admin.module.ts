import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import config from 'src/config';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.jwt.accessSecret,
      signOptions: { expiresIn: config.jwt.accessExpired },
    }),
    forwardRef(() => AdminModule),
  ],

  providers: [JwtStrategy, AuthService],
  exports: [JwtModule, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
