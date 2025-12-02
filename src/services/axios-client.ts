/**
 * Axios Client Configuration
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '@/types';

// Create axios instance with base configuration
const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    // Add token to headers if available
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Calculate request duration
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.log(`API Request: ${response.config.url} - ${duration}ms`);
    }

    // Return data directly if wrapped in ApiResponse
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return {
        ...response,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = typeof window !== 'undefined' 
          ? localStorage.getItem('refresh_token') 
          : null;

        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken);
            }
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('token_expiry');
          sessionStorage.removeItem('isAuthenticated');
          
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      errors: error.response?.data?.errors,
      statusCode: error.response?.status,
    };

    return Promise.reject(apiError);
  }
);

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

export default axiosClient;

