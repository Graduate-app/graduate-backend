import { Admin } from '../entity/admin.entity';
import { Exclude } from 'class-transformer';

export class AdminResponse {
  id: number;
  email: string;
  superAdmin: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  passwordHash: string;

  @Exclude()
  refreshTokenHash: string;

  constructor(partial: Partial<Admin>) {
    Object.assign(this, partial);
  }
}
