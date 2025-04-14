import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return 'Redirecting to Google...';
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    console.log(user);
    const existingUser = await this.userService.findByEmail(user.email);
    if (!existingUser) {
      console.log('creating new user');
      this.userService.create({
        email: user.email,
        name: user.name,
        googleId: user.id,
      });
    }
    //Generate access token
    const access_token = await this.authService.generateAccessToken(user);

    //Generate refresh token
    const refresh_token = await this.authService.generateRefreshToken(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      path: '/',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    res.redirect('http://localhost:5000');
  }

  // Route to refresh access token
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const newAccessToken =
      await this.authService.refreshAccessToken(refreshToken);
    return { accessToken: newAccessToken }; // Return new access token
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const accessToken = req.cookies?.access_token;
    if (!accessToken) {
      return { user: null };
    }

    try {
      const decoded = await this.authService.verifyAccessToken(accessToken);
      const user = await this.userService.findByEmail(decoded.email);
      return user;
    } catch (err) {
      console.error('Token invalid or expired:', err);
      return { user: null };
    }
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    console.log('logout endpoint hit', req.cookies);
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 0,
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 0,
    });
    return { message: 'Logged out successfully' };
  }
}
