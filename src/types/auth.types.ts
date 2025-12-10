/**
 * Authentication Types - Matches backend auth validations and responses
 */

import { User } from "./user.types";

/**
 * Login request - email OR phone required
 */
export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

/**
 * Register request - email OR phone required
 */
export interface RegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

/**
 * Send OTP request
 */
export interface SendOtpRequest {
  email?: string;
  phone?: string;
}

/**
 * Verify OTP request
 */
export interface VerifyOtpRequest {
  email?: string;
  phone?: string;
  otp: string;
}

/**
 * Login with 2FA request
 */
export interface Login2FARequest {
  userId: string;
  code: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 2FA Setup response
 */
export interface TwoFASetupResponse {
  qrCode: string;
  manualKey: string;
  otpauthUrl: string;
}

/**
 * 2FA Verify request (for setup)
 */
export interface TwoFAVerifyRequest {
  code: string;
}

/**
 * 2FA Disable request
 */
export interface TwoFADisableRequest {
  password: string;
}

/**
 * Backup codes response
 */
export interface BackupCodesResponse {
  backupCodes: string[];
}

/**
 * Masked backup codes response
 */
export interface MaskedBackupCodesResponse {
  backupCodes: {
    code: string;
    used: boolean;
  }[];
}

/**
 * Login response
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  requires2FA?: boolean;
  userId?: string;
}

/**
 * OTP verification response
 */
export interface VerifyOtpResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  requires2FA?: boolean;
  userId?: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Register response
 */
export interface RegisterResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string | null;
  isVerified: boolean;
  twoFactorEnabled: boolean;
}

