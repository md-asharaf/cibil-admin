"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon, BoxIconLine } from "@/icons";
import { dashboardService, DashboardStats } from "@/services/dashboard.service";
import { toast } from "sonner";

export const DashboardMetrics = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error: any) {
        console.error("Failed to load dashboard stats:", error);
        toast.error("Error", { description: "Failed to load dashboard statistics" });
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
              <div className="mt-5 h-4 bg-gray-200 rounded w-24 dark:bg-gray-700"></div>
              <div className="mt-2 h-8 bg-gray-200 rounded w-32 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Users Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.totalUsers.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {stats.usersGrowth.toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Verified Users Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Verified Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {stats.verifiedUsers.toLocaleString()}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            {stats.totalUsers > 0
              ? ((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1)
              : 0}
            %
          </Badge>
        </div>
      </div>
    </div>
  );
};


