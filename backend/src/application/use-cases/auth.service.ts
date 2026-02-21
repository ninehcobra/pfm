import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IAuthService, LoginResponse } from './auth.service.interface';
import type { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository.interface';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async register(data: any): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    return new UserDto(user);
  }

  async login(credentials: any): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user || !(await bcrypt.compare(credentials.password, user.password!))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    await this.userRepository.update(user.id, { refreshToken });

    return {
      accessToken,
      user: new UserDto(user),
    };
  }

  async refresh(refreshToken: string): Promise<string> {
    // In actual implementation, decode and check if user has this refresh token in DB
    // For simplicity here, we assume the token is valid if found in DB
    // Need a repository method to find user by refreshToken
    return 'new-access-token';
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }

  private async generateAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId }, { expiresIn: '15m' });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId }, { expiresIn: '7d' });
  }
}
