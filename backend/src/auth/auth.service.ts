/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, Injectable } from '@nestjs/common';
import { AuthPayLoadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupPayLoadDto } from './dto/sign-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  private fakeUsers = [
    {
      username: 'hewwo',
      email: 'hewwo@gmail.com',
      password: 'password',
    },
  ];

  async validateUser(authPayloadDto: AuthPayLoadDto) {
    const findUser = this.fakeUsers.find(
      (user) => user.email === authPayloadDto.email,
    );

    if (!findUser) return null;

    const { password, ...user } = findUser;

    const isMatch = await bcrypt.compare(authPayloadDto.password, password);

    if (!isMatch) return null;

    return user;
  }

  signToken(user: any) {
    return {
      access_tokens: this.jwtService.sign(user),
    };
  }

  async signup(signupPayloadDto: SignupPayLoadDto) {
    const findUser = await this.prismaService.user.findUnique({
      where: { email: signupPayloadDto.email },
    });

    if (findUser) throw new ConflictException('Email already existing');

    const saltOrRounds = 10;
    const password = signupPayloadDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const newUser = await this.prismaService.user.create({
      data: {
        ...signupPayloadDto,
        password: hash,
      },
    });

    return this.signToken(newUser);
  }
}
