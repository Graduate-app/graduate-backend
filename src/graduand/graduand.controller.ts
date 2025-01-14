import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GraduandService } from './graduand.service';
import { Graduand } from './entities/graduand.entity';
import { GraduandStatusEnum } from './enums/graduand-status.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateGraduandInput } from './dto/create-graduand.input';
import { ProfilePictureService } from './services/profile-pictures.service';

@Controller('graduand')
export class GraduandController {
  constructor(
    private readonly graduandService: GraduandService,
    private readonly profilePictureService: ProfilePictureService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getByFilter(@Body() filter: Partial<Graduand>) {
    try {
      return await this.graduandService.getGraduands(filter);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    try {
      return await this.graduandService.getOneGraduand(id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/send')
  async send(@Body() createGraduandInput: CreateGraduandInput) {
    try {
      const graduand = createGraduandInput as Graduand;
      graduand.status = GraduandStatusEnum.pending;

      if (createGraduandInput.profilePictureId) {
        graduand.profilePicture = await this.profilePictureService.getOne(
          createGraduandInput.profilePictureId,
        );
      }

      return await this.graduandService.createGraduand(graduand);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGraduandInput: CreateGraduandInput) {
    try {
      const graduand = createGraduandInput as Graduand;
      graduand.status = GraduandStatusEnum.applied;

      if (createGraduandInput.profilePictureId) {
        graduand.profilePicture = await this.profilePictureService.getOne(
          createGraduandInput.profilePictureId,
        );
      }

      return await this.graduandService.createGraduand(graduand);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/apply/:id')
  async apply(@Param('id') id: number) {
    try {
      return await this.graduandService.updateGraduand(id, {
        status: GraduandStatusEnum.applied,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/reject/:id')
  async reject(@Param('id') id: number) {
    try {
      return await this.graduandService.updateGraduand(id, {
        status: GraduandStatusEnum.rejected,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body()
    graduandUpdateInput: Partial<Graduand> & { profilePictureId?: number },
  ) {
    try {
      const {
        profilePictureId,
        ...graduandUpdateInputWithoutProfilePictureId
      } = graduandUpdateInput;
      const graduand = graduandUpdateInputWithoutProfilePictureId;

      if (profilePictureId) {
        graduand.profilePicture = await this.profilePictureService.getOne(
          profilePictureId,
        );
      }

      return await this.graduandService.updateGraduand(id, graduand);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    try {
      return await this.graduandService.deleteGraduand(id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
