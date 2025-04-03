import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return 'Redirecting to Google...';
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const user = await this.authService.validateUser(req.user);
    const access_token = this.authService.generateJwt(user);
    if (!access_token) {
      throw new UnauthorizedException({
        message: 'Invalid or expired token',
        error: 'Unauthorized',
        statusCode: 401,
      });
    }
    return access_token;
  }
}
