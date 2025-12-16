import { Controller, Get, Param, Post, Delete, Body, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: User) {
    try {
      return await this.usersService.createUser(user);
    } catch (error) {
      if (error.message === 'user with this email already exists') {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
