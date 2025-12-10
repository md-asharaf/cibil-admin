/**
 * User Management Types
 */

import { User } from './auth.types';

export interface UserProfile extends User {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  pan?: string;
  aadhaar?: string;
  // Additional frontend fields
  registeredDate?: string;
  lastLogin?: string | Date;
  reportsCount?: number;
  status?: 'Active' | 'Suspended' | 'Inactive';
}

export interface CreateUserRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  type?: 'user' | 'admin';
  role?: string;
  permissions?: string[];
  isVerified?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserListFilters {
  search?: string;
  role?: string;
  status?: 'Active' | 'Suspended' | 'Inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  inactive: number;
  newThisMonth: number;
}

