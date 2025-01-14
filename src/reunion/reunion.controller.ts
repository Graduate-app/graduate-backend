import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReunionService } from './reunion.service';
import { ReunionStatus } from './enums/reunion-status.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Reunion } from './entity/reunion.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { GraduandService } from 'src/graduand/graduand.service';
import config from 'src/config';

@Controller('reunion')
export class ReunionController {
  constructor(
    private readonly reunionService: ReunionService,
    private readonly mailService: MailerService,
    private readonly graduandService: GraduandService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Body('status') status?: ReunionStatus) {
    try {
      return await this.reunionService.getAll(status);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: number) {
    try {
      return await this.reunionService.getOne(id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() reunionInput: Reunion) {
    try {
      reunionInput.status = ReunionStatus.open;
      const reunion = await this.reunionService.create(reunionInput);
      const emails = [];

      for (const id of reunion.graduantIds) {
        emails.push((await this.graduandService.getOneGraduand(id)).email);
      }

      await this.mailService.sendMail({
        from: `Кафедра комп'ютерної інженерії та електроніки <${config.email.email}>`,
        to: emails,
        subject: `Зустріч випускників - ${reunion.anniversary}-річчя`,
        text: `Інформація: ${reunion.description}`,
      });

      return reunion;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Body() reunionUpdateInput: Partial<Reunion>,
    @Param('id') id: number,
  ) {
    try {
      const reunion = await this.reunionService.update(id, reunionUpdateInput);
      const emails = [];

      for (const id of reunion.graduantIds) {
        emails.push((await this.graduandService.getOneGraduand(id)).email);
      }

      await this.mailService.sendMail({
        from: `Кафедра комп'ютерної інженерії та електроніки <${config.email.email}>`,
        to: emails,
        subject: `Оновлено дані щодо зустрічі випускників`,
        text: `Річниця: ${reunion.anniversary}\n\nІнформація: ${reunion.description}`,
      });

      return reunion;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/close')
  async close(@Param('id') id: number) {
    try {
      return await this.reunionService.update(id, {
        status: ReunionStatus.closed,
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel')
  async cancel(
    @Param('id') id: number,
    @Body('cancelReason') cancelReason: string,
  ) {
    try {
      const reunion = await this.reunionService.update(id, {
        status: ReunionStatus.canceled,
        cancelReason,
      });
      const emails = [];

      for (const id of reunion.graduantIds) {
        emails.push((await this.graduandService.getOneGraduand(id)).email);
      }

      await this.mailService.sendMail({
        from: `Кафедра комп'ютерної інженерії та електроніки <${config.email.email}>`,
        to: emails,
        subject: `Скасована зустріч випускників`,
        text: `Причина скасування: ${reunion.cancelReason}`,
      });

      return reunion;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
