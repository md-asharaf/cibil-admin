import { createContext, useContext, useState, ReactNode } from "react";
import { ChevronLeft, LogOut, FileText, Users, BarChart3, Settings, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/contexts/auth-context";


interface SidebarContextType {
    collapsed: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};


export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleSidebar = () => setCollapsed(!collapsed);


    return (
        <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};


// Sidebar Component
export const Sidebar = () => {
    const { collapsed, toggleSidebar } = useSidebar();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: <LayoutDashboard size={22} />, id: "Dashboard", href: "", label: "Dashboard" },
        { icon: <FileText size={22} />, id: "Reports", href: "/reports", label: "Credit Reports" },
        { icon: <Users size={22} />, id: "Users", href: "/users", label: "User Management" },
        { icon: <BarChart3 size={22} />, id: "Analytics", href: "/analytics", label: "Analytics" },
        { icon: <Settings size={22} />, id: "Settings", href: "/settings", label: "Settings" },
    ];

    const handleLogout = () => {
        logout();
    };


    return (
        <div
            className={`h-[80vh] rounded-br-[50px] rounded-tl-4xl  flex flex-col justify-between items-center bg-primary text-primary-foreground py-6 transition-all duration-300 sticky top-0 ${collapsed ? "w-20" : " w-24"
                }`}
        >
            <div className="flex flex-col gap-8 mt-4">
                {menuItems.map((item) => (
                    <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                            <Link
                                href={item.href}
                                className="p-3 rounded-xl hover:bg-white/20 transition flex items-center gap-4"
                            >
                                {item.icon}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{item.label}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}

                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            onClick={toggleSidebar}
                            className="p-3 rounded-xl hover:bg-white/20 transition mb-4"
                        >
                            {
                                collapsed ? (
                                    <ChevronLeft size={22} />
                                ) : (
                                    <ChevronLeft size={22} className="rotate-180" />
                                )
                            }
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{collapsed ? "Expand Sidebar" : "Collapse Sidebar"}</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {/* User Actions */}
            <div className="flex flex-col gap-4 mb-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/profile" className="cursor-pointer p-1 rounded-xl transition hover:bg-white/20">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>
                                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{user?.name || 'Your Profile'}</p>
                    </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleLogout}
                            className="p-3 rounded-xl hover:bg-white/20 transition"
                            variant="ghost"
                        >
                            <LogOut size={22} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Logout</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div >
    );
};