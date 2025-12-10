/**
 * Permission Types - Matches backend IPermission interface
 */

export enum PermissionAction {
  READ = "read",
  UPDATE = "update",
  MANAGE = "manage",
  ALL = "all",
}

export interface Permission {
  _id: string;
  id?: string; // Alias for _id
  name: string;
  module: string;
  action: PermissionAction;
  fields: string[];
  description?: string;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Create permission request
 */
export interface CreatePermissionRequest {
  name: string;
  module: string;
  action: PermissionAction;
  fields: string[];
  description?: string;
}

/**
 * Update permission request
 */
export interface UpdatePermissionRequest {
  name?: string;
  module?: string;
  action?: PermissionAction;
  fields?: string[];
  description?: string;
  isActive?: boolean;
}

/**
 * Assign permissions to user request
 */
export interface AssignPermissionsRequest {
  userId: string;
  permissionIds: string[];
}

/**
 * Permission query filters
 */
export interface PermissionQueryFilters {
  isActive?: boolean;
  module?: string;
  action?: PermissionAction;
  page?: number;
  limit?: number;
}

/**
 * Permissions list response
 */
export interface PermissionsListResponse {
  permissions: Permission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

