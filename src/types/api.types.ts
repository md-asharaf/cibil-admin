/**
 * API Response Types
 */

// Generic API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

