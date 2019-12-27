import {
  Injectable,
  HttpException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async validateUniqueUsername(username: string): Promise<boolean> {
    let user: Users | undefined;
    try {
      user = await this.userRepository.findOne({
        where: [{ username: username }],
      });
    } catch (error) {
      throw new HttpException('', error);
    }
    if (user) {
      return true;
    }
    return false;
  }

  async validateUniqueEmail(email: string): Promise<boolean> {
    let user: Users | undefined;
    try {
      user = await this.userRepository.findOne({
        where: [{ email: email }],
      });
    } catch (error) {
      throw new HttpException('', error);
    }
    if (user) {
      return true;
    }
    return false;
  }

  async singup(user: RegisterDto): Promise<Users> {
    let invalidUsername: boolean;
    let invalidEmail: boolean;
    try {
      invalidUsername = await this.validateUniqueUsername(user.username);
    } catch (error) {
      throw new HttpException('', error);
    }
    if (invalidUsername) {
      throw new ConflictException();
    }
    try {
      invalidEmail = await this.validateUniqueEmail(user.email);
    } catch (error) {
      throw new HttpException('', error);
    }
    if (invalidEmail) {
      throw new ConflictException();
    }
    try {
      user.password = await bcrypt.hash(user.password, 10);
    } catch (error) {
      throw new HttpException('', error);
    }
    try {
      return this.userRepository.save(user);
    } catch (err) {
      throw new HttpException('', err);
    }
  }

  async changePassword(
    userId: number,
    pass: string,
  ): Promise<Users | undefined> {
    let user: Users | undefined;
    try {
      user = await this.userRepository.findOne(userId);
    } catch (error) {
      throw new HttpException('', error);
    }
    if (user) {
      try {
        user.password = await bcrypt.hash(pass, 10);
        return this.userRepository.save(user);
      } catch (error) {
        throw new HttpException('', error);
      }
    } else {
      throw new BadRequestException();
    }
  }
}
