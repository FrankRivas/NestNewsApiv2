import {
  Controller,
  Post,
  Body,
  UsePipes,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';
import { ValidationUserPipe } from './pipes/users.pipe';
import { RegisterDto } from '../users/dto/register.dto';
import { ValidationRegisterPipe } from './pipes/register.pipe';
import { Users } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @Post()
  @UsePipes(ValidationUserPipe)
  login(@Body() user: UserDto): {} {
    const accessToken = this.userService.login(user);
    return {
      accessToken,
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): void {
    this.userService.findAll();
  }
  @Post('/signup')
  @UsePipes(ValidationRegisterPipe)
  signup(@Body() user: RegisterDto): Promise<Users> {
    return this.userService.singup(user);
  }
  @UseGuards(AuthGuard('local'))
  @Post('/prueba')
  async logg(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
