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

  async createMurmur(userId: number, text: string): Promise<Murmur> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const murmur = this.murmursRepo.create({ text, user });
    return await this.murmursRepo.save(murmur);
  }

  async deleteMurmur(userId: number, murmurId: number): Promise<Murmur> {
    const murmur = await this.murmursRepo.findOne({ where: { id: murmurId }, relations: ['user'] });

    if (!murmur) throw new NotFoundException('Murmur not found');
    if (murmur.user.id !== userId) throw new ForbiddenException('Cannot delete others murmur');

    return await this.murmursRepo.remove(murmur);
  }

  async likeMurmur(userId: number, murmurId: number): Promise<Like> {
    const murmur = await this.murmursRepo.findOne({ where: { id: murmurId } });
    if (!murmur) throw new NotFoundException('Murmur not found');

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.likesRepo.findOne({ where: { user: { id: userId }, murmur: { id: murmurId } } });
    if (existing) return existing;

    const like = this.likesRepo.create({ user: { id: userId }, murmur });
    return await this.likesRepo.save(like);
  }

  async unlikeMurmur(userId: number, murmurId: number): Promise<Like> {
    const existing = await this.likesRepo.findOne({ where: { user: { id: userId }, murmur: { id: murmurId } } });
    if (!existing) throw new NotFoundException('Like not found');
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return await this.likesRepo.remove(existing);
  }

  async getOwnTimeline(userId: number, page = 1, perPage = 10): Promise<Murmur[]> {

    return await this.murmursRepo.find({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'likes', 'likes.user'],
      order: { id: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }

  async getFollowTimeline(userId: number, page = 1, perPage = 10): Promise<Murmur[]> {
    const follows = await this.followsRepo.find({
      where: [
        { follower: { id: userId } },
        { following: { id: userId } },
      ],
      relations: ['follower', 'following'],
    });
    if (!follows) throw new NotFoundException('Follow not found');

    const followeeIds = [...follows.map(follow => follow.following.id), userId];

    return await this.murmursRepo.createQueryBuilder('murmur')
      .where(`murmur.user.id IN (:...followeeIds)`, { followeeIds })
      .leftJoinAndSelect('murmur.user', 'user')
      .leftJoinAndSelect('murmur.likes', 'like')
      .leftJoinAndSelect('like.user', 'likeUser')
      .select(['murmur.id', 'murmur.text', 'murmur.createdAt', 'user.id', 'user.name', 'likeUser.name', 'likeUser.id', 'like'])
      .orderBy('murmur.createdAt', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany();
  }
}