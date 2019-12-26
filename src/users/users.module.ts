import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { Users } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Users]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
