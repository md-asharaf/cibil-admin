'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services";
import { monthlyTrends, creditScoreRanges, loanTypes, topCities, COLORS } from "@/data";
import { Loader2 } from "lucide-react";

const tooltipStyle = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

export default function AnalyticsPage() {
  // Fetch monthly trends
  const { data: trendsData, isLoading: loadingTrends } = useQuery({
    queryKey: ['analytics-monthly-trends'],
    queryFn: async () => {
      try {
        const response = await analyticsService.getMonthlyTrends();
        return response.success ? response.data : monthlyTrends;
      } catch (error) {
        return monthlyTrends;
      }
    },
  });

  // Fetch credit score distribution
  const { data: distributionData, isLoading: loadingDistribution } = useQuery({
    queryKey: ['analytics-credit-distribution'],
    queryFn: async () => {
      try {
        const response = await analyticsService.getCreditScoreDistribution();
        return response.success ? response.data : creditScoreRanges;
      } catch (error) {
        return creditScoreRanges;
      }
    },
  });

  // Fetch loan type distribution
  const { data: loanData, isLoading: loadingLoans } = useQuery({
    queryKey: ['analytics-loan-distribution'],
    queryFn: async () => {
      try {
        const response = await analyticsService.getLoanTypeDistribution();
        return response.success ? response.data : loanTypes;
      } catch (error) {
        return loanTypes;
      }
    },
  });

  // Fetch geographic data
  const { data: geoData, isLoading: loadingGeo } = useQuery({
    queryKey: ['analytics-geographic'],
    queryFn: async () => {
      try {
        const response = await analyticsService.getGeographicData();
        return response.success ? response.data : topCities;
      } catch (error) {
        return topCities;
      }
    },
  });

  // Fetch revenue trends
  const { data: revenueData, isLoading: loadingRevenue } = useQuery({
    queryKey: ['analytics-revenue-trends'],
    queryFn: async () => {
      try {
        const response = await analyticsService.getRevenueTrends();
        return response.success ? response.data : monthlyTrends.map(m => ({ date: m.month, value: m.revenue }));
      } catch (error) {
        return monthlyTrends.map(m => ({ date: m.month, value: m.revenue }));
      }
    },
  });

  const monthlyTrendsData = trendsData || monthlyTrends;
  const creditScoreRangesData = distributionData || creditScoreRanges;
  const loanTypesData = loanData || loanTypes;
  const topCitiesData = geoData || topCities;
  const revenueTrendsData = revenueData || monthlyTrends.map(m => ({ date: m.month, value: m.revenue }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Analytics & Insights</h1>
          <p className="text-gray-600">
            Comprehensive analytics and data insights for CIBIL system
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">User Analytics</TabsTrigger>
            <TabsTrigger value="credit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Credit Analytics</TabsTrigger>
            <TabsTrigger value="geographic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Geographic</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Monthly Trends</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Growth trends over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingTrends ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Area type="monotone" dataKey="users" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Users" />
                        <Area type="monotone" dataKey="reports" stackId="2" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} name="Reports" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Revenue Trends</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Monthly revenue generation</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRevenue ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Revenue (₹)" dot={{ fill: '#10b981', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

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
                    <BarChart data={creditScoreRangesData}>
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
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">User Growth</CardTitle>
                <CardDescription className="text-sm text-gray-600">New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTrends ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} name="New Users" dot={{ fill: '#6366f1', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Loan Type Distribution</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Distribution of different loan types</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingLoans ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={loanTypesData as any}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name}: ${entry.value}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {loanTypesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Credit Score Ranges</CardTitle>
                  <CardDescription className="text-sm text-gray-600">Percentage distribution of credit scores</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingDistribution ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={creditScoreRangesData as any}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.range}: ${entry.percentage}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {creditScoreRangesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Top Cities by Usage</CardTitle>
                <CardDescription className="text-sm text-gray-600">User and report distribution by city</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingGeo ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topCitiesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="city" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                      <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} name="Users" />
                      <Bar dataKey="reports" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Reports" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
