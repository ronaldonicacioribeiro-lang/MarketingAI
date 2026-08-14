import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirstAdminDto } from './dto/first-admin.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('first-admin')
  @HttpCode(HttpStatus.CREATED)
  createFirstAdmin(@Body() dto: FirstAdminDto) {
    return this.authService.createFirstAdmin(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
