import { Controller, Post, Body, UnauthorizedException, Req, BadRequestException,  InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class UserController {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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

      const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role },{ secret: this.configService.get('JWT_SECRET')});
      await this.userService.storeToken(user.id, token);
      return { token };

    }catch(err){
      throw new InternalServerErrorException('Unable to login');
    }
    
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    await this.userService.deleteToken(body.userId);
    return { message: 'Logged out' };
  }

}
