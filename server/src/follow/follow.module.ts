import { Module } from '@nestjs/common';
import { FollowsService } from './follow.service';
import { FollowsController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/entities/follow.entity';
import { User } from 'src/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule { }
