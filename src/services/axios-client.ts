/**
 * Axios Client - Simple configuration
 */

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types";
import { tokenStorage } from "@/utils/token-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

// Request interceptor - Add token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 and unwrap response
axiosClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Unwrap ApiResponse structure
    return {
      ...response,
      data: response.data.data ?? response.data,
    } as AxiosResponse<any>;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh is in progress, wait for it
      if (refreshPromise) {
        const token = await refreshPromise;
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        }
      }

      // Start refresh
      refreshPromise = (async () => {
        try {
          const refreshToken = tokenStorage.getRefreshToken();
          if (!refreshToken) {
            throw new Error("No refresh token");
          }

          const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          const tokens = response.data.data || response.data as any;
          if (tokens?.accessToken) {
            tokenStorage.setAccessToken(tokens.accessToken);
            if (tokens.refreshToken) {
              tokenStorage.setRefreshToken(tokens.refreshToken);
            }
            return tokens.accessToken;
          }
          return null;
        } catch (refreshError) {
          tokenStorage.clearAll();
          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          throw refreshError;
        } finally {
          refreshPromise = null;
        }
      })();

      try {
        const token = await refreshPromise;
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        }
      } catch {
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
