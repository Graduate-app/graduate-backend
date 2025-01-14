import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/admin.module';
import { SeedCommand } from './seed.command';
import { AuthService } from 'src/auth/auth.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [AuthModule, AdminModule],
  providers: [SeedCommand, AuthService],
})
export class SeedModule {}
