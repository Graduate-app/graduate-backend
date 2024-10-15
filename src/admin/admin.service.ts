import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entity/admin.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { CreateAdminInput } from './dto/create-admin.input';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async createAdmin(createInput: CreateAdminInput): Promise<Admin> {
    const hashedPassword = await argon2.hash(createInput.password);
    const admin = await this.adminRepository.create({
      ...createInput,
      refreshTokenHash: null,
      passwordHash: hashedPassword,
    });

    return await this.adminRepository.save(admin);
  }

  async findAllAdmins(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async findByEmail(email: string): Promise<Admin> {
    return await this.adminRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<Admin> {
    return await this.adminRepository.findOneBy({ id });
  }

  async setRefreshToken(adminId: number, refreshToken: string): Promise<void> {
    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.adminRepository.update(adminId, { refreshTokenHash });
  }

  async changePassword(adminId: number, newPassword: string): Promise<void> {
    const passwordHash = await argon2.hash(newPassword);
    await this.adminRepository.update(adminId, { passwordHash });
  }

  async deleteAdmin(adminId: number): Promise<void> {
    await this.adminRepository.delete({ id: adminId });
  }
}
