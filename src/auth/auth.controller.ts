import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignDto } from './dto/sign.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Admin } from 'src/admin/entity/admin.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/add-admin')
  async signUp(@Body() signUpInput: SignDto, @CurrentUser() admin: Admin) {
    try {
      if (!admin.superAdmin) {
        throw new Error('You are not a super admin');
      }

      return await this.authService.signUp(signUpInput);
    } catch (e) {
      return {
        status: e.status,
        message: e.message,
      };
    }
  }

  @Post('/signin')
  async signIn(@Body() signInInput: SignDto) {
    try {
      return await this.authService.signIn(signInInput);
    } catch (e) {
      return {
        status: e.status,
        message: e.message,
      };
    }
  }

  @Post('/refresh')
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    try {
      return await this.authService.refreshTokens(refreshToken);
    } catch (e) {
      return {
        status: e.status,
        message: e.message,
      };
    }
  }
}
