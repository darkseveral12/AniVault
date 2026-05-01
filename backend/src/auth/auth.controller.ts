import { Req, Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { Request } from 'express';
import { SignupPayLoadDto } from './dto/sign-auth.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() request: Request) {
    return this.authService.signToken(request.user);
  }

  @Post('signup')
  signup(@Body(ValidationPipe) signupPayloadDto: SignupPayLoadDto) {
    return this.authService.signup(signupPayloadDto);
  }
}
