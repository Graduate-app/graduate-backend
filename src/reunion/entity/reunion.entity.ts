import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReunionStatus } from '../enums/reunion-status.enum';

@Entity()
export class Reunion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { array: true })
  graduantIds: number[];

  @Column()
  description: string;

  @Column({ nullable: true })
  cancelReason: string;

  @Column()
  anniversary: number;

  @Column()
  status: ReunionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
