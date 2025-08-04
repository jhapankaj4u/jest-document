import { Injectable ,Inject } from '@nestjs/common';
import { InjectModel,  } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import { Redis } from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';


export interface IUserService{
  register(email: string, password: string): Promise<User>
  signToken(user, secrate:string): Promise<string>;
  validateUser(email: string, password: string): Promise<User>;
   deleteToken(token: string , secrate : string): Promise<void>
}

@Injectable()
export class UserService implements IUserService {
  
  constructor(@InjectModel(User) private userModel: typeof User , @Inject('REDIS_CLIENT') private readonly redis: Redis, private readonly jwtService: JwtService) {}

  async register(email: string, password: string): Promise<User> {

    const hash = await bcrypt.hash(password, 10);

    return this.userModel.create({ email, password: hash });
  }

  async signToken(user, secrate:string) : Promise<string> {

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role },{ secret: secrate});
    await this.storeToken(user.id, token);
    return token;
  }

  async validateUser(email: string, password: string): Promise<User> {

    const user = await this.userModel.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  private async storeToken(userId: string, token: string): Promise<void> {
    await this.redis.set(`auth:token:${userId}`, token);
    console.log(await this.redis.get(`auth:token:${userId}`))
  }

  async deleteToken(token: string , secrate : string): Promise<void> {
    const decoded = jwt.verify(token, secrate);    
    await this.redis.del(`auth:token:${decoded['id']}`);
  }

}
