import { Injectable ,Inject } from '@nestjs/common';
import { InjectModel,  } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import { Redis } from 'ioredis';

@Injectable()
export class UserService {
  
  constructor(@InjectModel(User) private userModel: typeof User , @Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async register(email: string, password: string) {

    const hash = await bcrypt.hash(password, 10);

    return this.userModel.create({ email, password: hash });
  }

  async validateUser(email: string, password: string) {

    const user = await this.userModel.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async storeToken(userId: string, token: string): Promise<void> {
    await this.redis.set(`auth:token:${userId}`, token);
  }

  async deleteToken(userId: string): Promise<void> {
    await this.redis.del(`auth:token:${userId}`);
  }

}
