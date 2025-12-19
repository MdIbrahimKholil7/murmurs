import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) { }

  async createUser(user: User) {
    if (await this.usersRepo.findOne({ where: { email: user.email } })) {
      throw new Error('user with this email already exists');
    }
    return await this.usersRepo.save(user);
  }
  async getAllUsers({ page = 1, perPage = 10, currentUserId }: { page?: number; perPage?: number; currentUserId?: number }): Promise<User[]> {
    return await this.usersRepo.find({
      where: {
        id: Not(currentUserId),
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }

  async loginByEmail(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new Error('user with this email does not exist');
    }
    return user;
  }
}
