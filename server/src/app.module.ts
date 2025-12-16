import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import { Like } from './entities/like.entity';
import { Murmur } from './entities/murmur.entity';
import { UserModule } from './user/user.module';
import { MurmursModule } from './murmurs/murmurs.module';
import { FollowsModule } from './follow/follow.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'docker',
      password: 'docker',
      database: 'test',
      entities: [User, Murmur, Like, Follow],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Murmur, Like, Follow]),
    UserModule,
    MurmursModule,
    FollowsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
