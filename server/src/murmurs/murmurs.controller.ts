import { Controller, Post, Delete, Param, Body, Get, Query, BadRequestException } from '@nestjs/common';
import { MurmursService } from './murmurs.service';

@Controller('/murmurs')
export class MurmursController {
  constructor(private readonly murmursService: MurmursService) { }

  @Post('me/:userId')
  create(@Param('userId') userId: string, @Body('text') text: string) {
    try {
      return this.murmursService.createMurmur(+userId, text);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('/:userId')
  getMurmurs(@Param('userId') userId: string) {
    return this.murmursService.getMurmurs(+userId);
  }
  @Delete('me/:userId/:murmurId')
  delete(@Param('userId') userId: string, @Param('murmurId') murmurId: string) {
    return this.murmursService.deleteMurmur(+userId, +murmurId);
  }

  @Post('like/:userId/:murmurId')
  like(@Param('userId') userId: string, @Param('murmurId') murmurId: string) {
    return this.murmursService.likeMurmur(+userId, +murmurId);
  }

  @Delete('like/:userId/:murmurId')
  unlike(@Param('userId') userId: string, @Param('murmurId') murmurId: string) {
    return this.murmursService.unlikeMurmur(+userId, +murmurId);
  }

  @Get('own-timeline/:userId')
  ownTimeline(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.murmursService.getOwnTimeline(+userId, Number(page) || 1, Number(perPage) || 10);
  }
}
