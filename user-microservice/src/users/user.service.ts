import { Injectable ,Inject, NotFoundException } from '@nestjs/common';
import { InjectModel,  } from '@nestjs/sequelize';
import { User } from './user.model';


@Injectable()
export class UserService {
  
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async updateRole(userId: string, role: string) {
    const user = await this.userModel.findOne({ where: { id : userId } });
    if (!user) {
      throw new NotFoundException ('User not found');    
    }

    user.role = role;
    return await user.save();
    }

}
