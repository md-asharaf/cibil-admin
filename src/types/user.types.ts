/**
 * User Management Types
 */

export interface UserProfile extends User {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  pan?: string;
  aadhaar?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
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

