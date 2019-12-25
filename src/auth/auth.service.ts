import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistredUsers } from 'src/users/collections/users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const userDB = RegistredUsers.find(a => a.username === username);
    if (userDB) {
      if (userDB.password === pass) {
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
