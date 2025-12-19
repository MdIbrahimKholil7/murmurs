import { Module } from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { MurmursController } from './murmurs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Follow } from 'src/entities/follow.entity';
import { Like } from 'src/entities/like.entity';
import { Murmur } from 'src/entities/murmur.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Murmur, Like, Follow, User]),
  ],
  controllers: [MurmursController],
  providers: [MurmursService],
})
export class MurmursModule {}
