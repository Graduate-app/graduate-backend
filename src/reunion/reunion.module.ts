import { Module } from '@nestjs/common';
import { ReunionController } from './reunion.controller';
import { ReunionService } from './reunion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reunion } from './entity/reunion.entity';
import { GraduandService } from 'src/graduand/graduand.service';
import { Graduand } from 'src/graduand/entities/graduand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reunion, Graduand])],
  controllers: [ReunionController],
  providers: [ReunionService, GraduandService],
})
export class ReunionModule {}
