import { Controller, Post, Body, UnauthorizedException, Req, BadRequestException,  InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config'


@Controller('auth')
export class UserController {

  constructor(
    private userService: UserService,
    private configService: ConfigService
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    
    try{
      const user = await this.userService.register(body.email, body.password);
      return { message: 'User registered', user: { id: user.id, email: user.email } };
    }catch(err){

      if (err.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Email already exists');
      }
      throw new InternalServerErrorException('Unable to Register')
    }
  }

  @Post('login')
  async login(@Req() req: Request , @Body() body: { email: string; password: string }) {
    try{

      const user = await this.userService.validateUser(body.email, body.password);
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const token = await this.userService.signToken(user, this.configService.get('JWT_SECRET'));    
       return { token };

    }catch(err){
      throw new InternalServerErrorException('Unable to login');
    }
    
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    await this.userService.deleteToken(token, this.configService.get('JWT_SECRET'));
    return { message: 'Logged out' };
  }

}
