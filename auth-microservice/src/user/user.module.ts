import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'
@Module({
  imports: [
    SequelizeModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService , JwtService , ConfigService],
})
export class UserModule {}
