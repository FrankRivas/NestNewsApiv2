import {
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { RegistredUsers } from 'src/users/collections/users';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}
  async validateUser(username: string, pass: string): Promise<{}> {
    let userDB: Users | undefined;
    try {
      userDB = await this.userRepository.findOne({
        where: [{ username: username }],
      }); //const userDB = RegistredUsers.find(a => a.username === username);
    } catch (error) {
      throw new HttpException('', error);
    }
    if (userDB) {
      let comparation = false;
      try {
        comparation = await bcrypt.compare(pass, userDB.password);
      } catch (error) {
        throw new HttpException('', error);
      }
      //if (userDB.password === pass) {
      if (comparation) {
        const { password, ...result } = userDB;
        return result;
      } else {
        // If invalid password
        throw new UnauthorizedException('Wrong Credentials');
      }
    } else {
      // If user does not exist
      throw new UnauthorizedException('Wrong Credentials');
    }
    /*
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;*/
  }
  login(user: any): {} {
    const payload = { username: user.username, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
