"use client";
import React, { useEffect, useState } from "react";
import { dashboardService, DashboardStats } from "@/services/dashboard.service";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function SystemOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error: any) {
        console.error("Failed to load system overview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const series = stats
    ? [
        ((stats.activeRoles / stats.totalRoles) * 100).toFixed(2),
      ]
    : [0];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["System Health"],
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (isLoading || !stats) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] p-5 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 dark:bg-gray-700 mb-4"></div>
          <div className="h-[330px] bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  const systemHealth = stats.totalRoles > 0
    ? ((stats.activeRoles / stats.totalRoles) * 100).toFixed(1)
    : "0";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            System Overview
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Active roles and permissions
          </p>
        </div>
        <div className="relative">
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
          >
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-white/[0.03]"
            >
              <MoreDotIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <DropdownItem>View Details</DropdownItem>
            <DropdownItem>Export Report</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div id="chart" className="min-w-[280px]">
          <ReactApexChart
            options={options}
            series={series.map(Number)}
            type="radialBar"
            height={330}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 w-full">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Roles</p>
            <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
              {stats.activeRoles}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              of {stats.totalRoles} total
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Permissions</p>
            <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
              {stats.activePermissions}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              of {stats.totalPermissions} total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

