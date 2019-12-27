import {
  Controller,
  Post,
  Body,
  UsePipes,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';
import { ValidationUserPipe } from './pipes/users.pipe';
import { RegisterDto } from '../users/dto/register.dto';
import { ValidationRegisterPipe } from './pipes/register.pipe';
import { Users } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { UserNewsService } from './usernews.service';
import { ShareDto } from './dto/share.dto';
import { ValidationSharePipe } from './pipes/share.pipe';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly userNewService: UserNewsService,
  ) {}
  /*@Post()
  @UsePipes(ValidationUserPipe)
  login(@Body() user: UserDto): {} {
    const accessToken = this.userService.login(user);
    return {
      accessToken,
    };
  }*/
  /*@UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): void {
    this.userService.findAll();
  }*/

  @Post('/signup')
  @UsePipes(ValidationRegisterPipe)
  signup(@Body() user: RegisterDto): Promise<Users> {
    return this.userService.singup(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/singin')
  async singin(@Req() req: Request): Promise<{}> {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationSharePipe)
  @Post('/:userId/save')
  async save(
    @Body() article: ShareDto,
    @Param('userId') userId: number,
  ): Promise<{}> {
    return this.userNewService.saveArticle(article.url, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':userId/news')
  getArticles(@Param('userId') userId: number): {} {
    return this.userNewService.getArticles(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationSharePipe)
  @Post('/:userId/share')
  async share(
    @Body() article: ShareDto,
    @Param('userId') userId: number,
  ): Promise<{}> {
    return this.userNewService.saveArticle(article.url, userId, article.user);
  }
}
