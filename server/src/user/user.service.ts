import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(user: User) {
    if (await this.usersRepo.findOne({ where: { email: user.email } })) {
      throw new Error('user with this email already exists');
    }
    return await this.usersRepo.save(user);
  }
}
