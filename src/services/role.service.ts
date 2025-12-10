/**
 * Role Service - Matches backend /roles routes
 */

import axiosClient from "./axios-client";
import {
  ApiResponse,
  Role,
  RoleWithPermissions,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignRoleRequest,
  RoleQueryFilters,
  RolesListResponse,
} from "@/types";

export const roleService = {
  /**
   * GET /roles
   * Get all roles with filters and pagination
   */
  getRoles: async (filters?: RoleQueryFilters): Promise<ApiResponse<RolesListResponse>> => {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append("isActive", String(filters.isActive));
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const queryString = params.toString();
    const url = `/roles${queryString ? `?${queryString}` : ""}`;
    const response = await axiosClient.get<ApiResponse<RolesListResponse>>(url);
    return response.data;
  },

  /**
   * GET /roles/:id
   * Get role by ID
   */
  getRoleById: async (id: string): Promise<ApiResponse<RoleWithPermissions>> => {
    const response = await axiosClient.get<ApiResponse<RoleWithPermissions>>(`/roles/${id}`);
    return response.data;
  },

  /**
   * POST /roles
   * Create new role (Super Admin only)
   */
  createRole: async (data: CreateRoleRequest): Promise<ApiResponse<RoleWithPermissions>> => {
    const response = await axiosClient.post<ApiResponse<RoleWithPermissions>>("/roles", data);
    return response.data;
  },

  /**
   * PUT /roles/:id
   * Update role (Super Admin only)
   */
  updateRole: async (id: string, data: UpdateRoleRequest): Promise<ApiResponse<RoleWithPermissions>> => {
    const response = await axiosClient.put<ApiResponse<RoleWithPermissions>>(`/roles/${id}`, data);
    return response.data;
  },

  /**
   * PATCH /roles/:id
   * Partially update role (Super Admin only)
   */
  patchRole: async (id: string, data: Partial<UpdateRoleRequest>): Promise<ApiResponse<RoleWithPermissions>> => {
    const response = await axiosClient.patch<ApiResponse<RoleWithPermissions>>(`/roles/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /roles/:id
   * Delete role (Super Admin only)
   */
  deleteRole: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await axiosClient.delete<ApiResponse<{}>>(`/roles/${id}`);
    return response.data;
  },

  /**
   * POST /roles/assign
   * Assign role to user
   */
  assignRoleToUser: async (data: AssignRoleRequest): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ success: boolean }>>("/roles/assign", data);
    return response.data;
  },
};

export default roleService;

