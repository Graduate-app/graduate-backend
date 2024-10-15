import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture } from '../entities/profile-picture.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilePictureService {
  constructor(
    @InjectRepository(ProfilePicture)
    private graduandRepository: Repository<ProfilePicture>,
  ) {}

  async createProfilePictures(src: string) {
    const profilePicture = await this.graduandRepository.create({ src });

    return await this.graduandRepository.save(profilePicture);
  }

  async getOne(id: number) {
    return await this.graduandRepository.findOneBy({ id });
  }
}
