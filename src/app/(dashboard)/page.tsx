import type { Metadata } from "next";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import React from "react";
import MonthlyTrendsChart from "@/components/dashboard/MonthlyTrendsChart";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import RecentUsersTable from "@/components/dashboard/RecentUsersTable";
import SystemOverview from "@/components/dashboard/SystemOverview";

export const metadata: Metadata = {
  title: "CIBIL Dashboard | Admin Panel",
  description: "CIBIL Admin Dashboard Overview",
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5 lg:gap-6">
      <div className="col-span-12 space-y-5 sm:space-y-6 xl:col-span-7">
        <DashboardMetrics />

        <MonthlyTrendsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <SystemOverview />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentUsersTable />
      </div>
    </div>
  );
}


