/**
 * API Response Types - Matches backend ApiResponse structure
 */

export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  statusCode: number;
  success: false;
  message: string;
  error?: string;
  details?: any;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

