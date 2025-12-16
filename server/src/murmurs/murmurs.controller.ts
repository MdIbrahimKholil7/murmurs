import { Controller, Post, Delete, Param, Body, Get, Query, BadRequestException } from '@nestjs/common';
import { MurmursService } from './murmurs.service';

@Controller('/murmurs')
export class MurmursController {
  constructor(private readonly murmursService: MurmursService) { }

  @Post('me/:userId')
  async create(@Param('userId') userId: string, @Body('text') text: string) {
    try {
      return await this.murmursService.createMurmur(+userId, text);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('me/:userId/:murmurId')
  async delete(@Param('userId') userId: string, @Param('murmurId') murmurId: string) {
    try {
      return await this.murmursService.deleteMurmur(+userId, +murmurId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('like/:userId/:murmurId')
  async like(@Param('userId') userId: string, @Param('murmurId') murmurId: string) {
    try {
      return await this.murmursService.likeMurmur(+userId, +murmurId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('like/:userId/:murmurId')
  async unlike(@Param('userId') userId: string, @Param('murmurId') murmurId: string) {
    try {
      return await this.murmursService.unlikeMurmur(+userId, +murmurId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('own-timeline/:userId')
  async ownTimeline(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    try {
      return await this.murmursService.getOwnTimeline(+userId, Number(page) || 1, Number(perPage) || 10);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('follow-timeline/:userId')
  async followTimeline(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    try {
      return await this.murmursService.getFollowTimeline(+userId, Number(page) || 1, Number(perPage) || 10);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
