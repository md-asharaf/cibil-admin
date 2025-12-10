"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Handles route protection and authentication state management
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/reset-password", "/otp/verify", "/2fa/verify"];
  const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    // Don't redirect if still loading or on a public route
    if (isLoading || isPublicRoute) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access to public routes or authenticated users
  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>;
  }

  // Show nothing while redirecting
  return null;
}

