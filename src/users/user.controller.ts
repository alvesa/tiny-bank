import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('tiny-bank')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: any) {
    this.userService.createUser(user);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch('deactivate')
  deactivateUser(@Body() { email }: { email: string }) {
    return this.userService.deactivateUser(email);
  }
}
