/**
 * Authentication Types
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Administrator' | 'User' | 'Viewer';
  department?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginWithOTPRequest {
  email: string;
  otp: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  requires2FA?: boolean;
}

export interface Verify2FARequest {
  code: string;
  email?: string;
}

export interface Verify2FAResponse {
  verified: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface Setup2FARequest {
  secret: string;
  code: string;
}

export interface Setup2FAResponse {
  success: boolean;
  backupCodes: string[];
  qrCode?: string;
}

