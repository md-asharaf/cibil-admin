"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services";
import { tokenStorage } from "@/utils/token-storage";
import { User, LoginRequest, VerifyOtpRequest, Login2FARequest } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  verifyOtp: (emailOrPhone: string, otp: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/login", "/register", "/otp/verify", "/2fa/verify"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth on mount
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    const userData = tokenStorage.getUserData();
    
    if (token && userData) {
      setUser(userData);
    } else {
      tokenStorage.clearAll();
    }
    
    setIsLoading(false);
  }, []);

  // Handle redirects
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
    const hasAuth = !!tokenStorage.getAccessToken();

    if (!hasAuth && !isPublicRoute) {
      router.push("/login");
    } else if (hasAuth && isPublicRoute && pathname !== "/2fa/verify" && pathname !== "/otp/verify") {
      router.push("/");
    }
  }, [user, isLoading, pathname, router]);

  const login = async (emailOrPhone: string, password: string) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
    const request: LoginRequest = isEmail 
      ? { email: emailOrPhone, password }
      : { phone: emailOrPhone, password };
    
    const response = await authService.login(request);

    if (response.success && response.data) {
      const { user, accessToken, refreshToken, requires2FA, userId } = response.data;

      if (requires2FA && userId) {
        sessionStorage.setItem("2fa_userId", userId);
        router.push("/2fa/verify");
        toast.info("2FA Required", { description: "Please verify with your 2FA code" });
        return;
      }

      if (accessToken && refreshToken && user) {
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);
        tokenStorage.setUserData(user);
        setUser(user);
        router.push("/");
        toast.success("Login successful");
      }
    }
  };

  const verifyOtp = async (emailOrPhone: string, otp: string) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
    const request: VerifyOtpRequest = isEmail 
      ? { email: emailOrPhone, otp }
      : { phone: emailOrPhone, otp };
    
    const response = await authService.verifyOtp(request);

    if (response.success && response.data) {
      const { user, accessToken, refreshToken, requires2FA, userId } = response.data;

      if (requires2FA && userId) {
        sessionStorage.setItem("2fa_userId", userId);
        router.push("/2fa/verify");
        toast.info("2FA Required", { description: "Please verify with your 2FA code" });
        return;
      }

      if (accessToken && refreshToken && user) {
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);
        tokenStorage.setUserData(user);
        setUser(user);
        router.push("/");
        toast.success("Verification successful");
      }
    }
  };

  const verify2FA = async (code: string) => {
    const userId = sessionStorage.getItem("2fa_userId");
    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }

    const request: Login2FARequest = { userId, code };
    const response = await authService.login2FA(request);

    if (response.success && response.data) {
      const { user, accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken && user) {
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);
        tokenStorage.setUserData(user);
        sessionStorage.removeItem("2fa_userId");
        setUser(user);
        router.push("/");
        toast.success("Login successful");
      }
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenStorage.clearAll();
      setUser(null);
      router.push("/login");
      toast.success("Logged out");
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      tokenStorage.setUserData(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    verifyOtp,
    verify2FA,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
