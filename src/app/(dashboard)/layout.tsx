"use client"

import { Sidebar, SidebarProvider } from "@/components/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Bypass login check for development
    // useEffect(() => {
    //     if (!isLoading && !isAuthenticated) {
    //         router.push("/login");
    //     }
    // }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 min-h-screen">{children}</main>
            </div>
        </SidebarProvider>
    );
}