import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Admin } from './entity/admin.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AdminResponse } from './dto/admin.response';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@CurrentUser() admin: Admin) {
    try {
      return new AdminResponse(await this.adminService.findById(admin.id));
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    try {
      const admins = await this.adminService.findAllAdmins();
      return admins.map((admin) => new AdminResponse(admin));
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  async changePassword(
    @CurrentUser() admin: Admin,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      await this.adminService.changePassword(admin.id, newPassword);
      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteAdmin(@CurrentUser() admin: Admin, @Param('id') id: number) {
    try {
      if (!admin.superAdmin) {
        throw new Error('You are not a super admin');
      }
      await this.adminService.deleteAdmin(id);
      return true;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
