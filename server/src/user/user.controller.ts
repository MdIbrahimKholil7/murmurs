import { Controller, Get, Param, Post, Delete, Body, ConflictException, BadRequestException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from 'src/entities/user.entity';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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

  @Post('/login')
  async loginByEmail(@Body() { email }: { email: string }) {
    try {
      return await this.usersService.loginByEmail(email);
    } catch (error) {
      console.log({ error })
      if (error.message === 'user with this email does not exist') {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('/:page/:perPage/:currentUserId')
  async getAllUsers(
    @Param('page', ParseIntPipe) page: number,
    @Param('perPage', ParseIntPipe) perPage: number,
    @Param('currentUserId', ParseIntPipe) currentUserId: number,
  ) {
    return await this.usersService.getAllUsers({
      page,
      perPage,
      currentUserId,
    });
  }
}
