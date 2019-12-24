import {
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { User } from './interfaces/users';
import * as jwt from 'jsonwebtoken';
import { RegistredUsers } from './collections/users';
import { ConfigService } from '@nestjs/config';
import { Secret } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}
  login(user: User): string {
    const secretKey = this.configService.get<Secret>('SECRET_CODE_JWT');
    const userDB = RegistredUsers.find(a => a.username === user.username);
    if (userDB) {
      if (userDB.password === user.password) {
        const token = jwt.sign(user, secretKey ? secretKey : 'secretKey', {
          expiresIn: '1h',
        });
        return token;
      } else {
        // If invalid password
        throw new UnauthorizedException('Invalid password');
      }
    } else {
      // If user does not exist
      throw new UnauthorizedException('Invalid user');
    }
  }
  findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }
  async singup(user: RegisterDto): Promise<Users> {
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
}
