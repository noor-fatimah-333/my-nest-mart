import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional() // Name is optional for the create user DTO
  name?: string;

  @IsString()
  @IsOptional() // Google ID is optional for the create user DTO
  googleId?: string;

  @IsString()
  @IsOptional() // Make password optional for OAuth users
  password?: string; // Allow for optional password
}
