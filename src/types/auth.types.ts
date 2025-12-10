/**
 * Authentication Types
 */

export interface BackupCode {
  code: string;
  used: boolean;
  usedAt?: Date;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Permission {
  _id: string;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string; // Usually excluded from API responses, but included for completeness
  otp?: string | null;
  otpExpiry?: Date | null;
  type: 'user' | 'admin';
  role?: string | Role | 'Administrator' | 'User' | 'Viewer' | null; // ObjectId, populated Role, or legacy string format
  permissions?: string[] | Permission[]; // Array of ObjectIds or populated Permissions
  createdBy?: string | User | null; // ObjectId or populated User
  isVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | null; // Usually excluded from API responses
  backupCodes?: BackupCode[];
  createdAt?: Date;
  updatedAt?: Date;
  // Frontend convenience fields
  id?: string; // Alias for _id for compatibility
  avatar?: string; // Optional frontend field
}

/**
 * Helper function to get user role as a string
 */
export function getUserRoleName(user: User): string {
  if (typeof user.role === 'string') {
    // If it's already a string (legacy format or ObjectId)
    if (user.role === 'Administrator' || user.role === 'User' || user.role === 'Viewer') {
      return user.role;
    }
    // If it's an ObjectId, check type field
    return user.type === 'admin' ? 'Administrator' : 'User';
  }
  if (user.role && typeof user.role === 'object' && 'name' in user.role) {
    return user.role.name;
  }
  // Fallback to type field
  return user.type === 'admin' ? 'Administrator' : 'User';
}

/**
 * Helper function to check if user is admin
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.type === 'admin' || getUserRoleName(user) === 'Administrator';
}

/**
 * Helper function to get user ID (handles both _id and id)
 */
export function getUserId(user: User): string {
  return user._id || user.id || '';
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

