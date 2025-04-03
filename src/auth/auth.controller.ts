import {
  Body,
  Controller,
  Get,
  Post,
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
    const user = req.user;

    //Generate access token
    const access_token = await this.authService.generateAccessToken(user);

    //Generate refresh token
    const refresh_token = await this.authService.generateRefreshToken(user);
    return {
      access_token,
      refresh_token,
    };
  }

  // Route to refresh access token
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const newAccessToken =
      await this.authService.refreshAccessToken(refreshToken);
    return { accessToken: newAccessToken }; // Return new access token
  }
}
