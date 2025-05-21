import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register() {}
  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data.phone, data.password);
  }
  @Post('refresh-token')
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return result; // chỉ return accessToken mới
  }

  @Post()
  async checkToken(@Body('token') token: string) {
    const result = await this.authService.isAccessTokenValid(token);
    return result;
  }
  @UseGuards(JwtAuthGuard) // dùng access token để xác thực
  @Post('logout')
  async logout(@Req() req: Request, @Body() body: { refreshToken: string }) {
    const user = (req as any).user;
    await this.authService.logout(user.sub, body.refreshToken);
    return { message: 'Đăng xuất thành công' };
  }
}
