import {
  Controller,
  Delete,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PlayWithFriendDto } from './dtos/play-with-friend.dto';
import { User, UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  addUser(@Body() user: PlayWithFriendDto): User {
    return this.userService.addUser(user);
  }

  @Get()
  getUsers(): any {
    return this.userService.getUsers();
  }
}
