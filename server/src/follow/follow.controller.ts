import { Controller, Post, Delete, Get, Param, BadRequestException } from '@nestjs/common';
import { FollowsService } from './follow.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':followerId/:followeeId')
  async follow(@Param('followerId') followerId: string, @Param('followeeId') followeeId: string) {
    try {
      return await this.followsService.follow(+followerId, +followeeId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':followerId/:followeeId')
 async unfollow(@Param('followerId') followerId: string, @Param('followeeId') followeeId: string) {
    try {
      return await this.followsService.unfollow(+followerId, +followeeId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
