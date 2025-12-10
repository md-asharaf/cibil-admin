/**
 * Auth Service - Matches backend /auth routes
 */

import axiosClient from "./axios-client";
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  Login2FARequest,
  LoginResponse as Login2FAResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TwoFASetupResponse,
  TwoFAVerifyRequest,
  TwoFADisableRequest,
  BackupCodesResponse,
  MaskedBackupCodesResponse,
} from "@/types";

export const authService = {
  /**
   * POST /auth/login
   * Login with email/phone and password
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await axiosClient.post<any>("/auth/login", data);
      
      // Axios interceptor unwraps the response, so response.data is the inner data object
      // Backend returns: { accessToken, refreshToken, user } or { require2FA: true, userId }
      const responseData = response.data || response;
      
      // Handle 2FA requirement
      // Backend returns: { require2FA: true, userId: user._id }
      if (responseData.require2FA || responseData.requires2FA) {
        return {
          success: true,
          statusCode: 200,
          message: "2FA required",
          data: {
            user: null as any,
            accessToken: '',
            refreshToken: '',
            requires2FA: true,
            userId: responseData.userId || responseData.user_id,
          },
        };
      }
      
      // Map backend response to frontend format
      const loginData: LoginResponse = {
        user: {
          _id: responseData.user.id || responseData.user._id,
          id: responseData.user.id || responseData.user._id,
          name: responseData.user.name,
          email: responseData.user.email,
          phone: responseData.user.phone,
          type: responseData.user.type,
          role: responseData.user.role,
          isVerified: responseData.user.isVerified,
          twoFactorEnabled: responseData.user.twoFactorEnabled,
        },
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
        requires2FA: false,
      };
      
      return {
        success: true,
        statusCode: 200,
        data: loginData,
        message: "Login successful",
      };
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * POST /auth/register
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    const response = await axiosClient.post<ApiResponse<RegisterResponse>>("/auth/register", data);
    return response.data;
  },

  /**
   * POST /auth/otp/send
   * Send OTP to email or phone
   */
  sendOtp: async (data: SendOtpRequest): Promise<ApiResponse<{ email?: string; phone?: string }>> => {
    const response = await axiosClient.post<ApiResponse<{ email?: string; phone?: string }>>("/auth/otp/send", data);
    return response.data;
  },

  /**
   * POST /auth/otp/verify
   * Verify OTP
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> => {
    try {
      const response = await axiosClient.post<any>("/auth/otp/verify", data);
      const responseData = response.data || response;
      
      // Handle 2FA requirement after OTP verification
      // Backend returns: { require2FA: true, userId: user._id }
      if (responseData.require2FA || responseData.requires2FA) {
        return {
          success: true,
          statusCode: 200,
          message: "2FA required",
          data: {
            requires2FA: true,
            userId: responseData.userId || responseData.user_id,
          },
        };
      }
      
      // Map backend response to frontend format
      const verifyData: VerifyOtpResponse = {
        user: {
          _id: responseData.user.id || responseData.user._id,
          id: responseData.user.id || responseData.user._id,
          name: responseData.user.name,
          email: responseData.user.email,
          phone: responseData.user.phone,
          type: responseData.user.type,
          role: responseData.user.role,
          isVerified: responseData.user.isVerified,
          twoFactorEnabled: responseData.user.twoFactorEnabled,
        },
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
        requires2FA: false,
      };
      
      return {
        success: true,
        statusCode: 200,
        data: verifyData,
        message: "OTP verified successfully",
      };
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * POST /auth/2fa/login
   * Login with 2FA code
   */
  login2FA: async (data: Login2FARequest): Promise<ApiResponse<Login2FAResponse>> => {
    try {
      const response = await axiosClient.post<any>("/auth/2fa/login", data);
      const responseData = response.data || response;
      
      // Map backend response to frontend format
      const loginData: Login2FAResponse = {
        user: {
          _id: responseData.user.id || responseData.user._id,
          id: responseData.user.id || responseData.user._id,
          name: responseData.user.name,
          email: responseData.user.email,
          phone: responseData.user.phone,
          type: responseData.user.type,
          role: responseData.user.role,
          isVerified: responseData.user.isVerified,
          twoFactorEnabled: responseData.user.twoFactorEnabled,
        },
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
        requires2FA: false,
      };
      
      return {
        success: true,
        statusCode: 200,
        data: loginData,
        message: "Login successful with 2FA",
      };
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * POST /auth/refresh
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response = await axiosClient.post<ApiResponse<RefreshTokenResponse>>("/auth/refresh", data);
    return response.data;
  },

  /**
   * POST /auth/logout
   * Logout user
   */
  logout: async (): Promise<ApiResponse<{}>> => {
    const response = await axiosClient.post<ApiResponse<{}>>("/auth/logout");
    return response.data;
  },

  /**
   * POST /auth/2fa/enable
   * Setup 2FA (get QR code)
   */
  twoFASetup: async (): Promise<ApiResponse<TwoFASetupResponse>> => {
    const response = await axiosClient.post<ApiResponse<TwoFASetupResponse>>("/auth/2fa/enable");
    return response.data;
  },

  /**
   * POST /auth/2fa/verify
   * Verify 2FA code (for setup)
   */
  twoFAVerify: async (data: TwoFAVerifyRequest): Promise<ApiResponse<{ twoFactorEnabled: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ twoFactorEnabled: boolean }>>("/auth/2fa/verify", data);
    return response.data;
  },

  /**
   * POST /auth/2fa/disable
   * Disable 2FA
   */
  twoFADisable: async (data: TwoFADisableRequest): Promise<ApiResponse<{ twoFactorEnabled: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ twoFactorEnabled: boolean }>>("/auth/2fa/disable", data);
    return response.data;
  },

  /**
   * POST /auth/backup-codes/generate
   * Generate backup codes
   */
  generateBackupCodes: async (): Promise<ApiResponse<BackupCodesResponse>> => {
    const response = await axiosClient.post<ApiResponse<BackupCodesResponse>>("/auth/backup-codes/generate");
    return response.data;
  },

  /**
   * GET /auth/backup-codes
   * Get masked backup codes
   */
  getBackupCodes: async (): Promise<ApiResponse<MaskedBackupCodesResponse>> => {
    const response = await axiosClient.get<ApiResponse<MaskedBackupCodesResponse>>("/auth/backup-codes");
    return response.data;
  },
};

export default authService;

