/**
 * Analytics Types
 */

export interface MonthlyTrend {
  month: string;
  users: number;
  reports: number;
  revenue: number;
  disputes: number;
}

export interface CreditScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface LoanTypeDistribution {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

export interface GeographicData {
  city: string;
  state: string;
  users: number;
  reports: number;
  averageScore: number;
}

export interface AnalyticsOverview {
  totalUsers: number;
  totalReports: number;
  activeLoans: number;
  totalDisputes: number;
  averageCreditScore: number;
  revenue: number;
  growthRate: {
    users: number;
    reports: number;
    revenue: number;
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
  metric?: 'users' | 'reports' | 'revenue' | 'disputes';
}

