import { Controller, Post, Body, UnauthorizedException, Req } from '@nestjs/common';
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

    const user = await this.userService.register(body.email, body.password);

    return { message: 'User registered', user: { id: user.id, email: user.email } };
  }

  @Post('login')
  async login(@Req() req: Request , @Body() body: { email: string; password: string }) {

    console.log('URL:', req.url);
    console.log('Body:', body);
    const user = await this.userService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role },{ secret: this.configService.get('JWT_SECRET')});
    console.log(token)
    return { token };
    
  }
}
