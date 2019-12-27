import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { News } from '../news/entities/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NewToUser } from './entities/usernews.entity';
import {
  UserNewsInterface,
  UserSharedNewsInterface,
} from './interfaces/usernews';

@Injectable()
export class UserNewsService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(NewToUser)
    private readonly newsToUserRepository: Repository<NewToUser>,
  ) {}

  async saveArticle(
    url: string,
    userId: number,
    toUserId?: number,
  ): Promise<{}> {
    let user: Users | undefined;
    let news: News | undefined;
    try {
      user = await this.userRepository.findOne(userId);
    } catch (error) {
      throw new HttpException('', error);
    }
    if (!user) {
      throw new BadRequestException();
    }
    try {
      news = await this.newsRepository.findOne({
        where: [{ url: url }],
      });
    } catch (error) {
      throw new HttpException('', error);
    }
    if (!news) {
      const saveNew = {
        url,
      };
      try {
        news = await this.newsRepository.save(saveNew);
      } catch (error) {
        throw new HttpException('', error);
      }
    }
    const ntu = {
      news: news,
      user,
      sharedBy: toUserId ? toUserId : undefined,
    };
    try {
      await this.newsToUserRepository.save(ntu);
      return news;
    } catch (error) {
      throw new HttpException('', error);
    }
  }

  transformData(userNew: NewToUser): UserNewsInterface {
    const newUser = {
      sharedBy: userNew.sharedBy,
      url: userNew.news.url,
      savedAt: userNew.news.createdAt,
    };
    return newUser;
  }

  async getArticles(user: number): Promise<UserNewsInterface[] | undefined> {
    const usersNews = await this.userRepository.findOne({
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          newsToUser: 'user.newsToUser',
          news: 'newsToUser.news',
        },
      },
      where: { id: user },
    });
    return usersNews?.newsToUser.map(this.transformData);
  }

  transformSharedNews(userNew: NewToUser): UserSharedNewsInterface {
    const newUser = {
      shared: userNew.createdAt,
      to: userNew.user.username,
      url: userNew.news.url,
    };
    return newUser;
  }

  async getSharedArticles(
    user: number,
  ): Promise<UserSharedNewsInterface[] | undefined> {
    const usersNews = await this.newsToUserRepository.find({
      join: {
        alias: 'newsToUser',
        leftJoinAndSelect: {
          user: 'newsToUser.user',
          news: 'newsToUser.news',
        },
      },
      where: { sharedBy: user },
    });
    return usersNews.map(this.transformSharedNews);
  }
}
