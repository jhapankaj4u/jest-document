import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class UserController {

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {

    const user = await this.userService.register(body.email, body.password);

    return { message: 'User registered', user: { id: user.id, email: user.email } };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
    return { token };
    
  }
}
