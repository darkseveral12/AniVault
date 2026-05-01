import { ConflictException, Injectable } from '@nestjs/common';
import { AuthPayLoadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupPayLoadDto } from './dto/sign-auth.dto';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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
    const findUser = this.fakeUsers.find(
      (user) => user.email === signupPayloadDto.email,
    );

    if (findUser) throw new ConflictException('Email already existing');

    const saltOrRounds = 10;
    const password = signupPayloadDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const newUser = {
      ...signupPayloadDto,
      password: hash,
    };

    this.fakeUsers = [...this.fakeUsers, newUser];
    const token = this.signToken(newUser);

    console.log(token);
    return token;
  }
}
