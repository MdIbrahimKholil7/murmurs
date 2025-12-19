import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Murmur } from './murmur.entity';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email!: string;

  @IsOptional()
  @IsBoolean()
  @Column({ default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Murmur, murmur => murmur.user)
  murmurs!: Murmur[];
}
