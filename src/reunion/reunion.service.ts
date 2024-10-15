import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reunion } from './entity/reunion.entity';
import { Repository } from 'typeorm';
import { ReunionStatus } from './enums/reunion-status.enum';

@Injectable()
export class ReunionService {
  constructor(
    @InjectRepository(Reunion)
    private reunionRepository: Repository<Reunion>,
  ) {}

  async getOne(id: number): Promise<Reunion> {
    try {
      return await this.reunionRepository.findOneBy({ id });
    } catch (error) {
      throw new Error(`Failed: ${error.message}`);
    }
  }

  async getAll(status?: ReunionStatus): Promise<Reunion[]> {
    try {
      return await this.reunionRepository.find({ where: { status } });
    } catch (error) {
      throw new Error(`Failed: ${error.message}`);
    }
  }

  async create(reunionInput: Reunion): Promise<Reunion> {
    try {
      const reunion = this.reunionRepository.create(reunionInput);
      return await this.reunionRepository.save(reunion);
    } catch (error) {
      throw new Error(`Failed: ${error.message}`);
    }
  }

  async update(id: number, reunionInput: Partial<Reunion>): Promise<Reunion> {
    try {
      await this.reunionRepository.update(id, reunionInput);
      return await this.reunionRepository.findOneBy({ id });
    } catch (error) {
      throw new Error(`Failed: ${error.message}`);
    }
  }
}
