import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { FollowsService } from './follow.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':followerId/:followeeId')
  follow(@Param('followerId') followerId: string, @Param('followeeId') followeeId: string) {
    return this.followsService.follow(+followerId, +followeeId);
  }

  @Delete(':followerId/:followeeId')
  unfollow(@Param('followerId') followerId: string, @Param('followeeId') followeeId: string) {
    return this.followsService.unfollow(+followerId, +followeeId);
  }

}
