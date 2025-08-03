import { Module , MiddlewareConsumer ,RequestMethod} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {  RoleMiddleware } from './role.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    
    SequelizeModule.forFeature([User])   
  ],
  controllers: [UserController],
  providers: [UserService, RoleMiddleware, JwtService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RoleMiddleware)
      .forRoutes({ path: 'user/*', method: RequestMethod.ALL });
  }

}
