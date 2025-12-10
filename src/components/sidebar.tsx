"use client";
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { 
  LogOut, 
  Users, 
  Settings, 
  LayoutDashboard,
  Shield,
  KeyRound,
  Menu
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

interface SidebarContextType {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  isMobile: boolean;
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsExpanded((prev) => !prev);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider 
      value={{ 
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        isMobile
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const SidebarBackdrop = () => {
  const { isMobileOpen, toggleMobileSidebar, isMobile } = useSidebar();

  if (!isMobile || !isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
      onClick={toggleMobileSidebar}
      aria-hidden="true"
    />
  );
};

// Sidebar Component
export const Sidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar, isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = useCallback((path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  }, [pathname]);

  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      id: "Dashboard", 
      href: "/", 
      label: "Dashboard" 
    },
    { 
      icon: <Users size={20} />, 
      id: "Users", 
      href: "/users", 
      label: "Users" 
    },
    { 
      icon: <Shield size={20} />, 
      id: "Roles", 
      href: "/roles", 
      label: "Roles" 
    },
    { 
      icon: <KeyRound size={20} />, 
      id: "Permissions", 
      href: "/permissions", 
      label: "Permissions" 
    },
    { 
      icon: <Settings size={20} />, 
      id: "Settings", 
      href: "/settings/profile", 
      label: "Settings" 
    },
  ];

  const handleLogout = () => {
    logout();
    if (isMobile) {
      toggleMobileSidebar();
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      toggleMobileSidebar();
    }
  };

  const getUserInitials = () => {
    return user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed flex flex-col top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
          ${
            isExpanded || isMobileOpen
              ? "w-[290px]"
              : isHovered
              ? "w-[290px]"
              : "w-[90px]"
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:mt-0`}
        onMouseEnter={() => !isExpanded && !isMobile && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Section */}
        <div
          className={`py-8 flex ${
            !isExpanded && !isHovered ? "md:justify-center" : "justify-start"
          }`}
        >
          <Link href="/">
            {isExpanded || isHovered || isMobileOpen ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  CIBIL Admin
                </span>
              </div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "md:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Menu"
                  ) : (
                    <Menu size={16} />
                  )}
                </h2>
                <ul className="flex flex-col gap-4">
                  {menuItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          onClick={handleLinkClick}
                          className={`menu-item group ${
                            active ? "menu-item-active" : "menu-item-inactive"
                          } ${
                            !isExpanded && !isHovered
                              ? "md:justify-center"
                              : "md:justify-start"
                          }`}
                        >
                          <span
                            className={`${
                              active
                                ? "menu-item-icon-active"
                                : "menu-item-icon-inactive"
                            }`}
                          >
                            {item.icon}
                          </span>
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <span className="menu-item-text">{item.label}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </nav>

          {/* User Section */}
          <div className="mt-auto pb-6 border-t border-gray-200 dark:border-gray-800 pt-4">
            {/* User Profile */}
            <Link
              href="/settings/profile"
              onClick={handleLinkClick}
              className={`menu-item group menu-item-inactive mb-3 ${
                !isExpanded && !isHovered
                  ? "md:justify-center"
                  : "md:justify-start"
              }`}
            >
              <span className="menu-item-icon-inactive">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="/images/user/owner.jpg" alt={user?.name} />
                  <AvatarFallback className="bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="menu-item-text font-medium">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || user?.phone || "No contact"}
                  </span>
                </div>
              )}
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`menu-item group menu-item-inactive w-full ${
                !isExpanded && !isHovered
                  ? "md:justify-center"
                  : "md:justify-start"
              }`}
            >
              <span className="menu-item-icon-inactive">
                <LogOut size={20} />
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
