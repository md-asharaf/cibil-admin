'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye, Filter, FileText, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services";
import { toast } from "sonner";
import { CreditReport, GenerateReportRequest } from "@/types";
import { mockReports } from "@/data";

const getScoreColor = (score: number) => {
  if (score >= 750) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 650) return "text-blue-700 bg-blue-50 border-blue-200";
  if (score >= 550) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
};

const getStatusColor = (status: string) => {
  return status === "Active" 
    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
    : "bg-amber-50 text-amber-700 border-amber-200";
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch reports
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const response = await reportService.getReports();
        return response.success ? response.data : { data: mockReports, pagination: { page: 1, limit: 10, total: mockReports.length, totalPages: 1 } };
      } catch (error) {
        // Fallback to mock data on error
        return { data: mockReports, pagination: { page: 1, limit: 10, total: mockReports.length, totalPages: 1 } };
      }
    },
  });

  const reports = reportsData?.data || mockReports;

  // Generate report mutation
  const generateMutation = useMutation({
    mutationFn: (data: GenerateReportRequest) => reportService.generateReport(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: ['reports'] });
        toast.success("Report generated successfully", {
          description: `Report ${response.data.id} has been created`
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to generate report", {
        description: error?.message || "An error occurred while generating the report"
      });
    },
  });

  // View report mutation
  const viewMutation = useMutation({
    mutationFn: (reportId: string) => reportService.getReportById(reportId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success("Report loaded", {
          description: `Viewing report ${response.data.id}`
        });
        console.log("Report data:", response.data);
      }
    },
    onError: (error: any) => {
      toast.error("Failed to load report", {
        description: error?.message || "Could not retrieve report details"
      });
    },
  });

  // Download report mutation
  const downloadMutation = useMutation({
    mutationFn: (reportId: string) => reportService.downloadReport(reportId),
    onSuccess: (blob, reportId) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credit-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Report downloaded", {
        description: `Report ${reportId} has been downloaded`
      });
    },
    onError: (error: any) => {
      toast.error("Failed to download report", {
        description: error?.message || "Could not download the report"
      });
    },
  });

  const filteredReports = reports.filter(report =>
    report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = () => {
    // In a real app, you'd have a form to select user/PAN
    generateMutation.mutate({
      userId: "U001",
      pan: "ABCDE1234F",
      purpose: "Admin Review"
    });
  };

  const handleViewReport = (reportId: string) => {
    viewMutation.mutate(reportId);
  };

  const handleDownloadReport = (reportId: string) => {
    downloadMutation.mutate(reportId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-2">Credit Reports</h1>
            <p className="text-gray-600">
              Manage and view all credit reports
            </p>
          </div>
          <Button 
            onClick={handleGenerateReport}
            disabled={generateMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, PAN, or report ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">All Credit Reports</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {isLoading ? "Loading..." : `${filteredReports.length} report(s) found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Report ID</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">User Name</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">PAN</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Credit Score</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Generated</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <span className="font-mono text-sm text-gray-900 font-medium">{report.id}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-900">{report.userName}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm text-gray-600">{report.pan}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-md text-sm font-semibold border ${getScoreColor(report.creditScore)}`}>
                            {report.creditScore}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(report.generatedDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => handleViewReport(report.id)}
                              disabled={viewMutation.isPending}
                            >
                              {viewMutation.isPending ? (
                                <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-600" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => handleDownloadReport(report.id)}
                              disabled={downloadMutation.isPending}
                            >
                              {downloadMutation.isPending ? (
                                <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 text-gray-600" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
