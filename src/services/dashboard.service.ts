/**
 * Dashboard Service - Aggregates data from various services for dashboard overview
 */

import { userService } from "./user.service";
import { roleService } from "./role.service";
import { permissionService } from "./permission.service";

export interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  adminUsers: number;
  totalRoles: number;
  activeRoles: number;
  totalPermissions: number;
  activePermissions: number;
  usersGrowth: number; // Percentage change
  recentUsers: any[]; // Last 5 users
}

export interface MonthlyTrend {
  month: string;
  users: number;
  reports: number;
  disputes: number;
}

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // Fetch all data in parallel
      const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
        userService.getUsers({ limit: 1000 }), // Get all users for stats
        roleService.getRoles({ limit: 1000 }),
        permissionService.getPermissions({ limit: 1000 }),
      ]);

      // Extract data (axios interceptor unwraps ApiResponse)
      const users = (usersResponse as any).users || [];
      const roles = (rolesResponse as any).roles || [];
      const permissions = (permissionsResponse as any).permissions || [];

      // Calculate stats
      const totalUsers = users.length;
      const verifiedUsers = users.filter((u: any) => u.isVerified).length;
      const adminUsers = users.filter((u: any) => u.type === "admin").length;
      
      const totalRoles = roles.length;
      const activeRoles = roles.filter((r: any) => r.isActive).length;
      
      const totalPermissions = permissions.length;
      const activePermissions = permissions.filter((p: any) => p.isActive).length;

      // Calculate growth (mock for now - in real app, compare with previous period)
      const usersGrowth = 12.5; // Mock percentage

      // Get recent users (last 5, sorted by createdAt)
      const recentUsers = users
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 5);

      return {
        totalUsers,
        verifiedUsers,
        adminUsers,
        totalRoles,
        activeRoles,
        totalPermissions,
        activePermissions,
        usersGrowth,
        recentUsers,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  },

  /**
   * Get monthly trends (mock data for now)
   * In a real app, this would aggregate data from reports/disputes endpoints
   */
  getMonthlyTrends: async (): Promise<MonthlyTrend[]> => {
    // Mock data - in real app, fetch from backend analytics endpoint
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return months.map((month, index) => ({
      month,
      users: Math.floor(Math.random() * 100) + 50,
      reports: Math.floor(Math.random() * 200) + 100,
      disputes: Math.floor(Math.random() * 50) + 10,
    }));
  },
};

export default dashboardService;


