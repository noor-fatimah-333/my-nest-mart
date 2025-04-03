import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async validateUser(user: any) {
    // In a real app, check if user exists in DB, and create if not.
    return user;
  }

  async generateJwt(user: any) {
    const payload = { email: user.email, sub: user.sub };
    return { access_token: this.jwtService.sign(payload) };
  }
}
