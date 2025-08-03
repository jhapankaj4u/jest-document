import { Controller, Patch, Param, Body} from '@nestjs/common';
import { UserService } from './user.service';
 
@Controller('user')
export class UserController {
  constructor( private readonly userService: UserService) {}

  
  @Patch(':id')
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') role: string 
  ) {
    
    await this.userService.updateRole(userId,role)
    return { message: `Role for user updated to ${role}` };
  }
}