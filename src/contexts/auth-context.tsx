'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, LoginRequest, LoginWithOTPRequest, Verify2FARequest } from '@/types';
import { authService } from '@/services';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOTP: (email: string, otp: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          // Verify token is still valid (in production, verify with API)
          const tokenExpiry = localStorage.getItem('token_expiry');
          if (tokenExpiry && new Date(tokenExpiry) > new Date()) {
            setUser(JSON.parse(userData));
          } else {
            // Token expired, try to refresh
            await refreshToken();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token_expiry');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('2faEnabled');
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    try {
      const request: LoginRequest = { email, password };
      const response = await authService.login(request);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken, expiresIn, requires2FA } = response.data;

        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + expiresIn);

        // Store tokens and user data
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('token_expiry', expiry.toISOString());
        sessionStorage.setItem('isAuthenticated', 'true');

        setUser(user);

        if (requires2FA) {
          router.push('/2fa/verify');
        } else {
          router.push('/');
          toast.success('Login successful', { description: 'Welcome back!' });
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'Invalid credentials';
      toast.error('Login failed', { description: errorMessage });
      throw error;
    }
  };

  const loginWithOTP = async (email: string, otp: string) => {
    try {
      const request: LoginWithOTPRequest = { email, otp };
      const response = await authService.loginWithOTP(request);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken, expiresIn, requires2FA } = response.data;

        // Calculate expiry time
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + expiresIn);

        // Store tokens and user data
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('token_expiry', expiry.toISOString());
        sessionStorage.setItem('isAuthenticated', 'true');

        setUser(user);

        // Check if 2FA is required
        if (requires2FA) {
          router.push('/2fa/verify');
        } else {
          router.push('/');
          toast.success('Login successful', { description: 'Welcome back!' });
        }
      }
    } catch (error: any) {
      console.error('OTP login error:', error);
      const errorMessage = error?.message || 'Invalid OTP';
      toast.error('Verification failed', { description: errorMessage });
      throw error;
    }
  };

  const verify2FA = async (code: string) => {
    try {
      const request: Verify2FARequest = { code };
      const response = await authService.verify2FA(request);

      if (response.success && response.data) {
        const { verified, accessToken, refreshToken } = response.data;

        if (verified && accessToken && refreshToken) {
          // Update tokens if provided
          localStorage.setItem('auth_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          
          // Get user data from storage (should already be set from login)
          const userData = localStorage.getItem('user_data');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }

        toast.success('Verification successful! Access granted.');
        router.push('/');
      }
    } catch (error: any) {
      console.error('2FA verification error:', error);
      const errorMessage = error?.message || 'Invalid code';
      toast.error('Verification failed', { description: errorMessage });
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token');
      }

      const request = { refreshToken: refreshTokenValue };
      const response = await authService.refreshToken(request);

      if (response.success && response.data) {
        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;

        // Calculate expiry time
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + expiresIn);

        // Update tokens
        localStorage.setItem('auth_token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        localStorage.setItem('token_expiry', expiry.toISOString());
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuth();
      router.push('/login');
      toast.error('Session expired', { description: 'Please login again' });
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithOTP,
    verify2FA,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

