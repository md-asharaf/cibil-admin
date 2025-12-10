/**
 * User Service - Matches backend /users routes
 */

import axiosClient from "./axios-client";
import {
  ApiResponse,
  User,
  UserWithRelations,
  CreateUserRequest,
  CreateAdminRequest,
  UpdateUserRequest,
  UserQueryFilters,
  UsersListResponse,
} from "@/types";

export const userService = {
  /**
   * GET /users
   * Get all users with filters and pagination
   */
  getUsers: async (filters?: UserQueryFilters): Promise<ApiResponse<UsersListResponse>> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.isVerified !== undefined) params.append("isVerified", String(filters.isVerified));
    if (filters?.role) params.append("role", filters.role);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const queryString = params.toString();
    const url = `/users${queryString ? `?${queryString}` : ""}`;
    const response = await axiosClient.get<ApiResponse<UsersListResponse>>(url);
    return response.data;
  },

  /**
   * GET /users/:id
   * Get user by ID
   */
  getUserById: async (id: string): Promise<ApiResponse<UserWithRelations>> => {
    const response = await axiosClient.get<ApiResponse<UserWithRelations>>(`/users/${id}`);
    return response.data;
  },

  /**
   * PUT /users/:id
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<ApiResponse<UserWithRelations>> => {
    const response = await axiosClient.put<ApiResponse<UserWithRelations>>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * PATCH /users/:id
   * Partially update user
   */
  patchUser: async (id: string, data: Partial<UpdateUserRequest>): Promise<ApiResponse<UserWithRelations>> => {
    const response = await axiosClient.patch<ApiResponse<UserWithRelations>>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /users/:id
   * Delete user (Super Admin only)
   */
  deleteUser: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await axiosClient.delete<ApiResponse<{}>>(`/users/${id}`);
    return response.data;
  },
};

export default userService;

