/**
 * User Service
 */

import axiosClient from './axios-client';
import {
  UserProfile,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserListFilters,
  UserStats,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

export const userService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await axiosClient.get<ApiResponse<UserProfile>>('/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateUserRequest): Promise<ApiResponse<UserProfile>> => {
    const response = await axiosClient.put<ApiResponse<UserProfile>>('/users/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<{ changed: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ changed: boolean }>>('/users/change-password', data);
    return response.data;
  },

  /**
   * Get all users with filters
   */
  getUsers: async (filters?: UserListFilters): Promise<ApiResponse<PaginatedResponse<UserProfile>>> => {
    const response = await axiosClient.get<ApiResponse<PaginatedResponse<UserProfile>>>('/users', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<ApiResponse<UserProfile>> => {
    const response = await axiosClient.get<ApiResponse<UserProfile>>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Create new user
   */
  createUser: async (data: UpdateUserRequest): Promise<ApiResponse<UserProfile>> => {
    const response = await axiosClient.post<ApiResponse<UserProfile>>('/users', data);
    return response.data;
  },

  /**
   * Update user by ID
   */
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<ApiResponse<UserProfile>> => {
    const response = await axiosClient.put<ApiResponse<UserProfile>>(`/users/${userId}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const response = await axiosClient.delete<ApiResponse<{ deleted: boolean }>>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Suspend user
   */
  suspendUser: async (userId: string): Promise<ApiResponse<{ suspended: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ suspended: boolean }>>(`/users/${userId}/suspend`);
    return response.data;
  },

  /**
   * Activate user
   */
  activateUser: async (userId: string): Promise<ApiResponse<{ activated: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ activated: boolean }>>(`/users/${userId}/activate`);
    return response.data;
  },

  /**
   * Get user statistics
   */
  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    const response = await axiosClient.get<ApiResponse<UserStats>>('/users/stats');
    return response.data;
  },
};

