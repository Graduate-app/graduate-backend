import { Injectable } from '@nestjs/common';
import { Graduand } from './entities/graduand.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Degree } from './entities/degree.entity';

@Injectable()
export class GraduandService {
  constructor(
    @InjectRepository(Graduand)
    private graduandRepository: Repository<Graduand>,
    private dataSource: DataSource,
  ) {}

  async getGraduands(filter: Partial<Graduand>): Promise<Graduand[]> {
    try {
      return await this.graduandRepository.find({
        where: filter,
        relations: ['degree', 'profilePicture'],
      });
    } catch (error) {
      throw new Error(`Failed: ${error.message}`);
    }
  }

  async getOneGraduand(id: number): Promise<Graduand> {
    try {
      return await this.graduandRepository.findOne({
        where: { id },
        relations: ['degree', 'profilePicture'],
      });
    } catch (error) {
      throw new Error(`Failed: ${error.message}`);
    }
  }

  async createGraduand(graduandData: Partial<Graduand>): Promise<Graduand> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const graduand = this.graduandRepository.create(graduandData);

      const savedGraduand = await queryRunner.manager.save(graduand);

      if (graduandData.degree && Array.isArray(graduandData.degree)) {
        const degrees = graduandData.degree.map((degreeData) => {
          const degree = new Degree(degreeData);
          degree.graduand = savedGraduand;
          return degree;
        });

        await queryRunner.manager.save(degrees);
      }

      await queryRunner.commitTransaction();

      return this.graduandRepository.findOne({
        where: { id: savedGraduand.id },
        relations: ['degree', 'profilePicture'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async updateGraduand(
    id: number,
    graduand: Partial<Graduand>,
  ): Promise<Graduand> {
    try {
      await this.graduandRepository.update(id, graduand);

      return await this.graduandRepository.findOneBy({ id });
    } catch (error) {
      throw new Error(`Failed to delete graduand: ${error.message}`);
    }
  }

  async deleteGraduand(id: number): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const graduand = await this.graduandRepository.findOne({
        where: { id },
        relations: ['degree', 'profilePicture'],
      });

      if (!graduand) {
        throw new Error('Graduand not found');
      }

      if (graduand.degree && graduand.degree.length > 0) {
        await queryRunner.manager.remove(graduand.degree);
      }

      await queryRunner.manager.remove(graduand);

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to delete graduand: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
