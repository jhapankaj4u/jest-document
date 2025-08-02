import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  
  constructor(@InjectModel(User) private userModel: typeof User) {}

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
}
