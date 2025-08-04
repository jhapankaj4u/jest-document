import { Controller, Patch, Param, Body, InternalServerErrorException} from '@nestjs/common';
import { UserService } from './user.service';
 
@Controller('user')
export class UserController {
  constructor( private readonly userService: UserService) {}

  
  @Patch(':id')
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') role: string 
  ) {

    try{
      await this.userService.updateRole(userId,role)
    }catch(err){
      throw new InternalServerErrorException(' Unable to assign role ');
    }
     return { message:"Role has been assigned successfully" }
   
  }
}