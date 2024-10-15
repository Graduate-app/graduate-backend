import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GraduandStatusEnum } from '../enums/graduand-status.enum';
import { HelpingOptionsEnum } from '../enums/helping-option.enum';
import { MajorEnum } from '../enums/major.enum';
import { Degree } from './degree.entity';
import { ProfilePicture } from './profile-picture.entity';

@Entity()
export class Graduand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: GraduandStatusEnum;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  patronymic: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @OneToOne(() => ProfilePicture, {
    nullable: true,
  })
  @JoinColumn()
  profilePicture: ProfilePicture | null;

  @OneToMany(() => Degree, (degree) => degree.graduand)
  degree: Degree[];

  @Column()
  major: MajorEnum;

  @Column()
  job: string;

  @Column()
  departamentHelping: HelpingOptionsEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
