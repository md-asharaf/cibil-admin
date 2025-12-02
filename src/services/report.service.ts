/**
 * Credit Report Service
 */

import axiosClient from './axios-client';
import {
  CreditReport,
  GenerateReportRequest,
  ReportFilters,
  ReportStats,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

export const reportService = {
  /**
   * Get all credit reports with filters
   */
  getReports: async (filters?: ReportFilters): Promise<ApiResponse<PaginatedResponse<CreditReport>>> => {
    const response = await axiosClient.get<ApiResponse<PaginatedResponse<CreditReport>>>('/reports', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get report by ID
   */
  getReportById: async (reportId: string): Promise<ApiResponse<CreditReport>> => {
    const response = await axiosClient.get<ApiResponse<CreditReport>>(`/reports/${reportId}`);
    return response.data;
  },

  /**
   * Generate new credit report
   */
  generateReport: async (data: GenerateReportRequest): Promise<ApiResponse<CreditReport>> => {
    const response = await axiosClient.post<ApiResponse<CreditReport>>('/reports/generate', data);
    return response.data;
  },

  /**
   * Download report as PDF
   */
  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await axiosClient.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get report statistics
   */
  getReportStats: async (): Promise<ApiResponse<ReportStats>> => {
    const response = await axiosClient.get<ApiResponse<ReportStats>>('/reports/stats');
    return response.data;
  },

  /**
   * Update report status
   */
  updateReportStatus: async (
    reportId: string,
    status: CreditReport['status']
  ): Promise<ApiResponse<CreditReport>> => {
    const response = await axiosClient.patch<ApiResponse<CreditReport>>(`/reports/${reportId}/status`, { status });
    return response.data;
  },

  /**
   * Delete report
   */
  deleteReport: async (reportId: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const response = await axiosClient.delete<ApiResponse<{ deleted: boolean }>>(`/reports/${reportId}`);
    return response.data;
  },
};

