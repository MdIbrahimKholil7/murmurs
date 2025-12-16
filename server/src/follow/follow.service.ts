import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from '../entities/follow.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class FollowsService {
    constructor(
        @InjectRepository(Follow) private readonly followsRepo: Repository<Follow>,
        @InjectRepository(User) private readonly usersRepo: Repository<User>,
    ) { }

    async follow(followerId: number, followeeId: number): Promise<Follow> {
        if (followerId === followeeId) throw new BadRequestException("Cannot follow yourself");

        const follower = await this.usersRepo.findOne({ where: { id: followerId } });
        const followee = await this.usersRepo.findOne({ where: { id: followeeId } });

        if (!follower || !followee) throw new NotFoundException('User not found');

        const existing = await this.followsRepo.findOne({
            where: { follower: { id: followerId }, following: { id: followeeId } },
        });

        if (existing) return existing;

        const follow = this.followsRepo.create({ follower, following: followee });
        return this.followsRepo.save(follow);
    }

    async unfollow(followerId: number, followeeId: number): Promise<Follow>{
        const existing = await this.followsRepo.findOne({
            where: { follower: { id: followerId }, following: { id: followeeId } },
        });
        if (!existing) throw new NotFoundException('Follow relationship not found');
        return this.followsRepo.remove(existing);
    }

}
