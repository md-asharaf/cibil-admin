/**
 * Analytics Service
 */

import axiosClient from './axios-client';
import {
  MonthlyTrend,
  CreditScoreDistribution,
  LoanTypeDistribution,
  GeographicData,
  AnalyticsOverview,
  TimeSeriesData,
  AnalyticsFilters,
  ApiResponse,
} from '@/types';

export const analyticsService = {
  /**
   * Get analytics overview
   */
  getOverview: async (): Promise<ApiResponse<AnalyticsOverview>> => {
    const response = await axiosClient.get<ApiResponse<AnalyticsOverview>>('/analytics/overview');
    return response.data;
  },

  /**
   * Get monthly trends
   */
  getMonthlyTrends: async (filters?: AnalyticsFilters): Promise<ApiResponse<MonthlyTrend[]>> => {
    const response = await axiosClient.get<ApiResponse<MonthlyTrend[]>>('/analytics/trends/monthly', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get credit score distribution
   */
  getCreditScoreDistribution: async (): Promise<ApiResponse<CreditScoreDistribution[]>> => {
    const response = await axiosClient.get<ApiResponse<CreditScoreDistribution[]>>('/analytics/credit-score/distribution');
    return response.data;
  },

  /**
   * Get loan type distribution
   */
  getLoanTypeDistribution: async (): Promise<ApiResponse<LoanTypeDistribution[]>> => {
    const response = await axiosClient.get<ApiResponse<LoanTypeDistribution[]>>('/analytics/loans/distribution');
    return response.data;
  },

  /**
   * Get geographic data
   */
  getGeographicData: async (filters?: AnalyticsFilters): Promise<ApiResponse<GeographicData[]>> => {
    const response = await axiosClient.get<ApiResponse<GeographicData[]>>('/analytics/geographic', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get time series data
   */
  getTimeSeriesData: async (
    metric: string,
    filters?: AnalyticsFilters
  ): Promise<ApiResponse<TimeSeriesData[]>> => {
    const response = await axiosClient.get<ApiResponse<TimeSeriesData[]>>(`/analytics/timeseries/${metric}`, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get revenue trends
   */
  getRevenueTrends: async (filters?: AnalyticsFilters): Promise<ApiResponse<TimeSeriesData[]>> => {
    const response = await axiosClient.get<ApiResponse<TimeSeriesData[]>>('/analytics/revenue/trends', {
      params: filters,
    });
    return response.data;
  },
};

