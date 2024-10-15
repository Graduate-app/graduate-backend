import { Module } from '@nestjs/common';
import { GraduandController } from './graduand.controller';
import { GraduandService } from './graduand.service';
import { Graduand } from './entities/graduand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePictureService } from './services/profile-pictures.service';
import { ProfilePicture } from './entities/profile-picture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Graduand, ProfilePicture])],
  controllers: [GraduandController],
  providers: [GraduandService, ProfilePictureService],
  exports: [ProfilePictureService],
})
export class GraduandModule {}
