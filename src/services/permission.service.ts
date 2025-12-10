/**
 * Permission Service - Matches backend /permissions routes
 */

import axiosClient from "./axios-client";
import {
  ApiResponse,
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  AssignPermissionsRequest,
  PermissionQueryFilters,
  PermissionsListResponse,
  PermissionAction,
} from "@/types";

export const permissionService = {
  /**
   * GET /permissions
   * Get all permissions with filters and pagination
   */
  getPermissions: async (filters?: PermissionQueryFilters): Promise<ApiResponse<PermissionsListResponse>> => {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append("isActive", String(filters.isActive));
    if (filters?.module) params.append("module", filters.module);
    if (filters?.action) params.append("action", filters.action);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const queryString = params.toString();
    const url = `/permissions${queryString ? `?${queryString}` : ""}`;
    const response = await axiosClient.get<ApiResponse<PermissionsListResponse>>(url);
    return response.data;
  },

  /**
   * GET /permissions/:id
   * Get permission by ID
   */
  getPermissionById: async (id: string): Promise<ApiResponse<Permission>> => {
    const response = await axiosClient.get<ApiResponse<Permission>>(`/permissions/${id}`);
    return response.data;
  },

  /**
   * GET /permissions/module/:module
   * Get permissions by module
   */
  getPermissionsByModule: async (module: string): Promise<ApiResponse<Permission[]>> => {
    const response = await axiosClient.get<ApiResponse<Permission[]>>(`/permissions/module/${module}`);
    return response.data;
  },

  /**
   * POST /permissions
   * Create new permission (Super Admin only)
   */
  createPermission: async (data: CreatePermissionRequest): Promise<ApiResponse<Permission>> => {
    const response = await axiosClient.post<ApiResponse<Permission>>("/permissions", data);
    return response.data;
  },

  /**
   * PUT /permissions/:id
   * Update permission (Super Admin only)
   */
  updatePermission: async (id: string, data: UpdatePermissionRequest): Promise<ApiResponse<Permission>> => {
    const response = await axiosClient.put<ApiResponse<Permission>>(`/permissions/${id}`, data);
    return response.data;
  },

  /**
   * PATCH /permissions/:id
   * Partially update permission (Super Admin only)
   */
  patchPermission: async (id: string, data: Partial<UpdatePermissionRequest>): Promise<ApiResponse<Permission>> => {
    const response = await axiosClient.patch<ApiResponse<Permission>>(`/permissions/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /permissions/:id
   * Delete permission (Super Admin only)
   */
  deletePermission: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await axiosClient.delete<ApiResponse<{}>>(`/permissions/${id}`);
    return response.data;
  },

  /**
   * POST /permissions/assign
   * Assign permissions to user
   */
  assignPermissionsToUser: async (data: AssignPermissionsRequest): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ success: boolean }>>("/permissions/assign", data);
    return response.data;
  },
};

export default permissionService;

