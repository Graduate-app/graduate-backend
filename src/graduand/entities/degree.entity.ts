import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DegreeEnum } from '../enums/degree.enum';
import { Graduand } from './graduand.entity';

@Entity()
export class Degree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  degree: DegreeEnum;

  @Column({ nullable: true })
  qualificationWork: string;

  @Column()
  enrollmentYear: number;

  @Column()
  graduationYear: number;

  @ManyToOne(() => Graduand, (graduand) => graduand.degree)
  graduand: Graduand;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Degree> = null) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
