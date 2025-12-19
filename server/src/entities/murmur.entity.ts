import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Like } from './like.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('murmurs')
export class Murmur {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Column({ length: 280 })
  text!: string;

  
  @ManyToOne(() => User, user => user.murmurs, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Like, like => like.murmur)
  likes!: Like[];

  @CreateDateColumn()
  createdAt!: Date;
}
