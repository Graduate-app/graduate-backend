import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import config from 'src/config';
import { SignDto } from './dto/sign.dto';
import { Admin } from 'src/admin/entity/admin.entity';
import { AdminService } from 'src/admin/admin.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtService,
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
  ) {}

  async generateJwtCredentials(admin: Admin) {
    const accessTokenPayload = {
      email: admin.email,
      sub: admin.id,
      superAdmin: admin.superAdmin,
    };

    const refreshTokenPayload = {
      uid: admin.id,
    };

    const accessToken = this.jwtTokenService.sign(accessTokenPayload);
    const refreshToken = this.jwtTokenService.sign(refreshTokenPayload, {
      secret: config.jwt.refreshSecret,
      expiresIn: config.jwt.refreshExpired,
    });

    await this.adminService.setRefreshToken(admin.id as number, refreshToken); // Storing hashed refresh token in database

    return {
      accessToken,
      refreshToken,
      expireAccessToken: config.jwt.accessExpired,
      expireRefreshToken: config.jwt.refreshExpired,
    };
  }

  async validate(userInput: SignDto): Promise<Admin | null> {
    const user = await this.adminService.findByEmail(userInput.email);

    if (user && (await argon2.verify(user.passwordHash, userInput.password))) {
      // Check if user exists and if password does not match the hashed password stored in the database
      return user;
    }

    return null;
  }

  async signUp(userInput: SignUpDto) {
    const existUser = await this.adminService.findByEmail(userInput.email);

    if (existUser) {
      throw new Error('User with this email exists already');
    }

    const user = await this.adminService.createAdmin({
      ...userInput,
    });

    return await this.generateJwtCredentials(user);
  }

  async signIn(userInput: SignDto) {
    const user = await this.validate(userInput);

    if (!user) {
      throw new Error('Email or password is wrong');
    }

    return await this.generateJwtCredentials(user);
  }

  async refreshTokens(refreshToken: string) {
    const payload = this.jwtTokenService.verify(refreshToken, {
      secret: config.jwt.refreshSecret,
    });
    const user = await this.adminService.findById(payload.uid);

    if (!user || !(await argon2.verify(user.refreshTokenHash, refreshToken))) {
      // Check if user does not exist or if the refresh token does not match the hashed refresh token stored in the database
      throw new Error('Invalid refresh token');
    }

    return await this.generateJwtCredentials(user);
  }
}
