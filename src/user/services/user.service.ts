/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { signInDto, signUpDto } from '../dto/user.dto';
import { User } from 'src/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

const users: User[] = [];
@Injectable()
export class UserService {
  async signUp(data: signUpDto) {
    const { firstName, lastName, email, phoneNumber, password } = data;
    const existingUser = users.find((u) => u.email === email);
    if (existingUser?.email) {
      throw new HttpException(
        'User with the provided email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const bcrptySaltRound = 10;
    const passwordHash = await hash(password, bcrptySaltRound);

    const newUser = new User();
    newUser.email = email;
    newUser.passwordHash = passwordHash;
    newUser.firstName = firstName;
    newUser.phoneNumber = phoneNumber;
    newUser.lastName = lastName;

    users.push(newUser);
    return newUser;
  }

  async signIn(data: signInDto) {
    const { email, password } = data;
    const existingUser = users.find((u) => u.email === email);
    if (!existingUser?.email) {
      throw new HttpException('signUp !!', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await compare(password, existingUser.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException('Wrong password !!', HttpStatus.UNAUTHORIZED);
    }
    const tokenData = {
      email: existingUser.email,
      phoneNumber: existingUser.phoneNumber,
      lastName: existingUser.lastName,
      firstName: existingUser.firstName,
    };
    const jwt_secret_key = 'lala';
    const token = sign(tokenData, jwt_secret_key, {
      expiresIn: '30d',
    });

    return {
      ...existingUser,
      token,
    };
  }
}
