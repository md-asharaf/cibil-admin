/**
 * Role Types - Matches backend IRole interface
 */

import type { Permission } from "./permission.types";

export interface Role {
  _id: string;
  id?: string; // Alias for _id
  name: string;
  description?: string;
  permissions?: string[] | Permission[];
  isActive: boolean;
  parentId?: string | Role | null;
  path: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Role with populated permissions
 */
export interface RoleWithPermissions extends Omit<Role, "permissions"> {
  permissions?: Permission[];
}

/**
 * Create role request
 */
export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissions?: string[];
  parentId?: string;
}

/**
 * Update role request
 */
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

/**
 * Assign role to user request
 */
export interface AssignRoleRequest {
  userId: string;
  roleId: string;
}

/**
 * Role query filters
 */
export interface RoleQueryFilters {
  isActive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Roles list response
 */
export interface RolesListResponse {
  roles: RoleWithPermissions[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

