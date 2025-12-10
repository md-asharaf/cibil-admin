"use client"

import { Sidebar, SidebarProvider, SidebarBackdrop, useSidebar } from "../../components/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import AppHeader from "@/layout/AppHeader";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isExpanded, isMobileOpen, isMobile, isHovered } = useSidebar();
    
    // Dynamic margin for main content based on sidebar state (matching template)
    const mainContentMargin = isMobileOpen || isMobile
        ? "ml-0"
        : isExpanded || isHovered
        ? "md:ml-[290px]"
        : "md:ml-[90px]";

    return (
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${mainContentMargin}`}>
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
    );
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <SidebarBackdrop />
                <div className="flex min-h-screen">
                    <Sidebar />
                    <DashboardContent>{children}</DashboardContent>
                </div>
            </SidebarProvider>
        </AuthGuard>
    );
}
