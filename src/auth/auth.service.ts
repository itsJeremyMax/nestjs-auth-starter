import * as argon2 from 'argon2';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { SignInDTO } from './dto/signin.dto';
import { SignUpDTO } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signUpAction({ email, password }: SignUpDTO) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      throw new HttpException(
        'Unable to use email address',
        HttpStatus.FORBIDDEN,
      );
    }

    password = await argon2.hash(password);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password,
      },
    });

    const jwtPayload: JwtPayload = {
      id: newUser.id,
    };

    const signedJwt = this.jwtService.sign(jwtPayload);

    return {
      jwt: signedJwt,
    };
  }

  async signInAction({ email, password }: SignInDTO) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExists) {
      throw new HttpException('User does not exist', HttpStatus.FORBIDDEN);
    }

    const passwordsMatch = await argon2.verify(userExists.password, password);

    if (!passwordsMatch) {
      throw new HttpException('Credentials do not match', HttpStatus.FORBIDDEN);
    }

    const jwtPayload: JwtPayload = {
      id: userExists.id,
    };

    const signedJwt = this.jwtService.sign(jwtPayload);

    return {
      jwt: signedJwt,
    };
  }
}
