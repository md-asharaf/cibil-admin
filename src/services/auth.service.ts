import axiosClient from './axios-client';
import {
  LoginRequest,
  LoginResponse,
  LoginWithOTPRequest,
  Verify2FARequest,
  Verify2FAResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  Setup2FARequest,
  Setup2FAResponse,
  ApiResponse,
} from '@/types';

export const authService = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  /**
   * Login with OTP
   */
  loginWithOTP: async (data: LoginWithOTPRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>('/auth/login/otp', data);
    return response.data;
  },

  /**
   * Send OTP to email
   */
  sendOTP: async (email: string): Promise<ApiResponse<{ sent: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ sent: boolean }>>('/auth/otp/send', { email });
    return response.data;
  },

  /**
   * Verify 2FA code
   */
  verify2FA: async (data: Verify2FARequest): Promise<ApiResponse<Verify2FAResponse>> => {
    const response = await axiosClient.post<ApiResponse<Verify2FAResponse>>('/auth/2fa/verify', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response = await axiosClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', data);
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    const response = await axiosClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    return response.data;
  },

  /**
   * Setup 2FA
   */
  setup2FA: async (data: Setup2FARequest): Promise<ApiResponse<Setup2FAResponse>> => {
    const response = await axiosClient.post<ApiResponse<Setup2FAResponse>>('/auth/2fa/setup', data);
    return response.data;
  },

  /**
   * Get 2FA QR code
   */
  get2FAQRCode: async (): Promise<ApiResponse<{ qrCode: string; secret: string }>> => {
    const response = await axiosClient.get<ApiResponse<{ qrCode: string; secret: string }>>('/auth/2fa/qrcode');
    return response.data;
  },

  /**
   * Disable 2FA
   */
  disable2FA: async (code: string): Promise<ApiResponse<{ disabled: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ disabled: boolean }>>('/auth/2fa/disable', { code });
    return response.data;
  },

  /**
   * Logout
   */
  logout: async (): Promise<ApiResponse<{ loggedOut: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ loggedOut: boolean }>>('/auth/logout');
    return response.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<ApiResponse<LoginResponse['user']>> => {
    const response = await axiosClient.get<ApiResponse<LoginResponse['user']>>('/auth/me');
    return response.data;
  },
};

