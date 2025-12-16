import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Murmur } from '../entities/murmur.entity';
import { User } from '../entities/user.entity';
import { Like } from '../entities/like.entity';
import { Follow } from 'src/entities/follow.entity';

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur) private readonly murmursRepo: Repository<Murmur>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Like) private readonly likesRepo: Repository<Like>,
    @InjectRepository(Follow) private readonly followsRepo: Repository<Follow>,
  ) { }

  async createMurmur(userId: number, text: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const murmur = this.murmursRepo.create({ text, user });
    return this.murmursRepo.save(murmur);
  }
  async getMurmurs(userId: number) {
    const murmurs = await this.murmursRepo.find({ where: { user: { id: userId } } });
    if (!murmurs) throw new NotFoundException('User not found');
    return murmurs;
  }
  async deleteMurmur(userId: number, murmurId: number) {
    const murmur = await this.murmursRepo.findOne({ where: { id: murmurId }, relations: ['user'] });

    if (!murmur) throw new NotFoundException('Murmur not found');
    if (murmur.user.id !== userId) throw new ForbiddenException('Cannot delete others murmur');

    return this.murmursRepo.remove(murmur);
  }

  async likeMurmur(userId: number, murmurId: number) {
    const murmur = await this.murmursRepo.findOne({ where: { id: murmurId } });
    if (!murmur) throw new NotFoundException('Murmur not found');

    const existing = await this.likesRepo.findOne({ where: { user: { id: userId }, murmur: { id: murmurId } } });
    if (existing) return existing;

    const like = this.likesRepo.create({ user: { id: userId }, murmur });
    return this.likesRepo.save(like);
  }

  async unlikeMurmur(userId: number, murmurId: number) {
    const existing = await this.likesRepo.findOne({ where: { user: { id: userId }, murmur: { id: murmurId } } });
    if (!existing) throw new NotFoundException('Like not found');
    return this.likesRepo.remove(existing);
  }

  async getOwnTimeline(userId: number, page = 1, perPage = 10) {

    return this.murmursRepo.find({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'likes'],
      order: { id: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }

}
