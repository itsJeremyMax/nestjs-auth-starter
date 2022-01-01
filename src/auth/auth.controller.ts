import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('signup')
  async sigUp(@Body() body: SignUpDTO) {
    return this.auth.signUpAction(body);
  }

  @Post('signin')
  async signIn(@Body() body: SignInDTO) {
    return this.auth.signInAction(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUser(@Req() req) {
    return req.user;
  }
}
