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
    const existingUser = await this.usersService.findByEmail(user.email);

    if (!existingUser) {
      const newUser = this.usersService.create({
        email: user.email,
        name: user.name,
        googleId: user.id,
      });
      return newUser;
    }

    return existingUser;
  }

  async verifyAccessToken(access_token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(access_token, {
        secret: process.env.JWT_SECRET, // Make sure you’ve set this in your env
      });
      return decoded;
    } catch (err) {
      throw new Error('Invalid or expired access token');
    }
  }
  async generateAccessToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  // Method to generate a refresh token
  async generateRefreshToken(user: User) {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = addDays(new Date(), 30); // Refresh token is valid for 30 days

    // Check if a refresh token already exists for the user
    let existingToken = await this.refreshTokenRepository.findOne({
      where: { googleId: user.id },
    });
    if (existingToken) {
      // Update the existing refresh token
      existingToken.token = refreshToken;
      existingToken.expiresAt = expiresAt;
      await this.refreshTokenRepository.save(existingToken);
    } else {
      // Create a new refresh token if none exists
      const newRefreshToken = this.refreshTokenRepository.create({
        googleId: user.id,
        token: refreshToken,
        expiresAt,
      });
      await this.refreshTokenRepository.save(newRefreshToken);
    }

    return refreshToken;
  }

  // Method to validate refresh token and generate new access token
  async refreshAccessToken(refreshToken: string) {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await this.usersService.findByGoogleId(storedToken.googleId);

    if (!user) {
      throw new Error('User not found');
    }

    return this.generateAccessToken(user); // Generate new access token
  }
}
