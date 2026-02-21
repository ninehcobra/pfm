import { UserDto } from '../dto/user.dto';

export interface LoginResponse {
  accessToken: string;
  user: UserDto;
}

export interface IAuthService {
  register(data: any): Promise<UserDto>;
  login(credentials: any): Promise<LoginResponse>;
  refresh(refreshToken: string): Promise<string>;
  logout(userId: string): Promise<void>;
}

export const AUTH_SERVICE = 'IAuthService';
