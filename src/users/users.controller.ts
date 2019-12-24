import { Controller, Post, Body, UsePipes, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';
import { ValidationUserPipe } from './pipes/users.pipe';
import { RegisterDto } from '../users/dto/register.dto';
import { ValidationRegisterPipe } from './pipes/register.pipe';
import { Users } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  @UsePipes(ValidationUserPipe)
  login(@Body() user: UserDto): {} {
    const accessToken = this.userService.login(user);
    return {
      accessToken,
    };
  }
  @Get()
  findAll(): void {
    this.userService.findAll();
  }
  @Post('/signup')
  @UsePipes(ValidationRegisterPipe)
  signup(@Body() user: RegisterDto): Promise<Users> {
    return this.userService.singup(user);
  }
}
