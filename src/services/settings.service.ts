/**
 * Settings Service
 */

import axiosClient from './axios-client';
import {
  SystemSettings,
  NotificationSettings,
  SecuritySettings,
  UpdateSettingsRequest,
  UpdateNotificationSettingsRequest,
  ApiResponse,
} from '@/types';

export const settingsService = {
  /**
   * Get system settings
   */
  getSystemSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    const response = await axiosClient.get<ApiResponse<SystemSettings>>('/settings/system');
    return response.data;
  },

  /**
   * Update system settings
   */
  updateSystemSettings: async (data: UpdateSettingsRequest): Promise<ApiResponse<SystemSettings>> => {
    const response = await axiosClient.put<ApiResponse<SystemSettings>>('/settings/system', data);
    return response.data;
  },

  /**
   * Get notification settings
   */
  getNotificationSettings: async (): Promise<ApiResponse<NotificationSettings>> => {
    const response = await axiosClient.get<ApiResponse<NotificationSettings>>('/settings/notifications');
    return response.data;
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (
    data: UpdateNotificationSettingsRequest
  ): Promise<ApiResponse<NotificationSettings>> => {
    const response = await axiosClient.put<ApiResponse<NotificationSettings>>('/settings/notifications', data);
    return response.data;
  },

  /**
   * Get security settings
   */
  getSecuritySettings: async (): Promise<ApiResponse<SecuritySettings>> => {
    const response = await axiosClient.get<ApiResponse<SecuritySettings>>('/settings/security');
    return response.data;
  },

  /**
   * Update security settings
   */
  updateSecuritySettings: async (data: Partial<SecuritySettings>): Promise<ApiResponse<SecuritySettings>> => {
    const response = await axiosClient.put<ApiResponse<SecuritySettings>>('/settings/security', data);
    return response.data;
  },
};

