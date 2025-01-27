import { Body, Controller, Post } from '@nestjs/common';
// import { AuthService } from '../services/auth.service';
import { signInDto, signUpDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  async signup(@Body() data: signUpDto) {
    const newUser = await this.userService.signUp(data);
    return {
      message: 'Successfully Created An Account With Us',
      user: newUser,
    };
  }

  @Post('login')
  async signin(@Body() data: signInDto) {
    const user = await this.userService.signIn(data);
    return {
      message: 'User Successfully Logged in !!',
      user,
    };
  }
}
