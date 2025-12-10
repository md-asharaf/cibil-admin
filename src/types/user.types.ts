/**
 * User Types - Matches backend IUser interface
 */

// Use type-only imports to avoid circular dependencies
import type { Permission } from "./permission.types";
import type { Role } from "./role.types";

export interface User {
  _id: string;
  id?: string; // Alias for _id
  name: string;
  email?: string;
  phone?: string;
  type: "user" | "admin";
  role?: string | Role | null;
  permissions?: string[] | Permission[];
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdBy?: string | User | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * User with populated relations
 */
export interface UserWithRelations extends Omit<User, "role" | "permissions" | "createdBy"> {
  role?: Role | null;
  permissions?: Permission[];
  createdBy?: {
    _id: string;
    name: string;
    email?: string;
  } | null;
}

/**
 * User creation request
 */
export interface CreateUserRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  type?: "user" | "admin";
  role?: string;
}

/**
 * Admin creation request
 */
export interface CreateAdminRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role?: string;
  permissions?: string[];
}

/**
 * User update request
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  twoFactorEnabled?: boolean;
}

/**
 * User query filters
 */
export interface UserQueryFilters {
  type?: "user" | "admin";
  isVerified?: boolean;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Users list response
 */
export interface UsersListResponse {
  users: UserWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Helper function to get user ID
 */
export function getUserId(user: User): string {
  return user._id || user.id || "";
}

/**
 * Helper function to get user role name
 */
export function getUserRoleName(user: User): string {
  if (typeof user.role === "string") {
    return user.role;
  }
  if (user.role && typeof user.role === "object" && "name" in user.role) {
    return user.role.name;
  }
  return user.type === "admin" ? "Administrator" : "User";
}

/**
 * Helper function to check if user is admin
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.type === "admin" || getUserRoleName(user) === "Administrator";
}

