'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services";
import { dashboardStats, monthlyTrendsData, creditScoreDistributionData, recentActivityData } from "@/data";

const tooltipStyle = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

export default function DashboardPage() {
  // Fetch dashboard overview data
  const { data: overviewData, isLoading: loadingOverview } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      try {
        const response = await analyticsService.getOverview();
        return response.success ? response.data : null;
      } catch (error) {
        return null;
      }
    },
  });

  // Fetch monthly trends
  const { data: trendsData, isLoading: loadingTrends } = useQuery({
    queryKey: ['monthly-trends'],
    queryFn: async () => {
      try {
        const response = await analyticsService.getMonthlyTrends();
        return response.success ? response.data : monthlyTrendsData;
      } catch (error) {
        return monthlyTrendsData;
      }
    },
  });

  // Fetch credit score distribution
  const { data: distributionData, isLoading: loadingDistribution } = useQuery({
    queryKey: ['credit-score-distribution'],
    queryFn: async () => {
      try {
        const response = await analyticsService.getCreditScoreDistribution();
        return response.success ? response.data : creditScoreDistributionData;
      } catch (error) {
        return creditScoreDistributionData;
      }
    },
  });

  const monthlyData = trendsData || monthlyTrendsData;
  const creditScoreDistribution = distributionData || creditScoreDistributionData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Overview of CIBIL credit information system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
            return (
              <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                  <div className="flex items-center text-sm mt-2">
                    <TrendIcon className={`h-4 w-4 mr-1 ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`} />
                    <span className={`font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="ml-2 text-gray-500">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Monthly Trends</CardTitle>
              <CardDescription className="text-sm text-gray-600">User growth and report generation over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTrends ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} name="Users" dot={{ fill: '#6366f1', r: 4 }} />
                    <Line type="monotone" dataKey="reports" stroke="#06b6d4" strokeWidth={2} name="Reports" dot={{ fill: '#06b6d4', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Credit Score Distribution</CardTitle>
              <CardDescription className="text-sm text-gray-600">Distribution of credit scores across all users</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDistribution ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={creditScoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
            <CardDescription className="text-sm text-gray-600">Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivityData.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "success" ? "bg-emerald-500" :
                      activity.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.user}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
