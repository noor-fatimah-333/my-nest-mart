import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { addDays } from 'date-fns';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}
  async validateUser(user: any) {
    // In a real app, check if user exists in DB, and create if not.
    return user;
  }

  async generateAccessToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  // Method to generate a refresh token
  async generateRefreshToken(user: User) {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = addDays(new Date(), 30); // Refresh token is valid for 30 days

    const newRefreshToken = this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    await this.refreshTokenRepository.save(newRefreshToken);

    return newRefreshToken;
  }

  // Method to validate refresh token and generate new access token
  async refreshAccessToken(refreshToken: string) {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(storedToken.userId);

    if (!user) {
      throw new Error('User not found');
    }

    return this.generateAccessToken(user); // Generate new access token
  }
}
