# Services Documentation

## Overview

The services folder contains all client-side API service functions using Axios with proper TypeScript typing and response handling.

## Structure

```
services/
├── axios-client.ts      # Axios instance with interceptors
├── auth.service.ts      # Authentication endpoints
├── user.service.ts      # User management endpoints
├── report.service.ts    # Credit report endpoints
├── analytics.service.ts # Analytics endpoints
├── settings.service.ts  # Settings endpoints
└── index.ts            # Central exports
```

## Axios Client (`axios-client.ts`)

### Features:
- **Base URL Configuration**: Uses `NEXT_PUBLIC_API_BASE_URL` environment variable
- **Request Interceptor**: Automatically adds JWT token to Authorization header
- **Response Interceptor**: 
  - Handles API response unwrapping
  - Automatic token refresh on 401 errors
  - Error handling and formatting
- **Request Timing**: Logs request duration for debugging

### Usage:
```tsx
import axiosClient from '@/services/axios-client';

// Direct axios usage (if needed)
const response = await axiosClient.get('/endpoint');
```

## Service Pattern

All services follow a consistent pattern:

```tsx
export const serviceName = {
  methodName: async (params): Promise<ApiResponse<ReturnType>> => {
    const response = await axiosClient.method<ApiResponse<ReturnType>>('/endpoint', data);
    return response.data;
  },
};
```

## Available Services

### 1. Auth Service (`auth.service.ts`)
- `login()` - Login with email/password
- `loginWithOTP()` - Login with OTP
- `sendOTP()` - Send OTP to email
- `verify2FA()` - Verify 2FA code
- `refreshToken()` - Refresh access token
- `register()` - Register new user
- `setup2FA()` - Setup 2FA
- `get2FAQRCode()` - Get 2FA QR code
- `disable2FA()` - Disable 2FA
- `logout()` - Logout user
- `getCurrentUser()` - Get current user info

### 2. User Service (`user.service.ts`)
- `getProfile()` - Get user profile
- `updateProfile()` - Update user profile
- `changePassword()` - Change password
- `getUsers()` - Get all users (paginated)
- `getUserById()` - Get user by ID
- `createUser()` - Create new user
- `updateUser()` - Update user
- `deleteUser()` - Delete user
- `suspendUser()` - Suspend user
- `activateUser()` - Activate user
- `getUserStats()` - Get user statistics

### 3. Report Service (`report.service.ts`)
- `getReports()` - Get all reports (paginated)
- `getReportById()` - Get report by ID
- `generateReport()` - Generate new report
- `downloadReport()` - Download report as PDF
- `getReportStats()` - Get report statistics
- `updateReportStatus()` - Update report status
- `deleteReport()` - Delete report

### 4. Analytics Service (`analytics.service.ts`)
- `getOverview()` - Get analytics overview
- `getMonthlyTrends()` - Get monthly trends
- `getCreditScoreDistribution()` - Get credit score distribution
- `getLoanTypeDistribution()` - Get loan type distribution
- `getGeographicData()` - Get geographic data
- `getTimeSeriesData()` - Get time series data
- `getRevenueTrends()` - Get revenue trends

### 5. Settings Service (`settings.service.ts`)
- `getSystemSettings()` - Get system settings
- `updateSystemSettings()` - Update system settings
- `getNotificationSettings()` - Get notification settings
- `updateNotificationSettings()` - Update notification settings
- `getSecuritySettings()` - Get security settings
- `updateSecuritySettings()` - Update security settings

## Usage Examples

### Basic Service Call
```tsx
import { authService } from '@/services';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

if (response.success) {
  const { user, accessToken } = response.data;
  // Handle success
}
```

### With Error Handling
```tsx
import { userService } from '@/services';
import { toast } from 'sonner';

try {
  const response = await userService.getProfile();
  if (response.success) {
    const user = response.data;
    // Use user data
  }
} catch (error: any) {
  toast.error('Failed to load profile', {
    description: error.message
  });
}
```

### Paginated Requests
```tsx
import { reportService } from '@/services';

const response = await reportService.getReports({
  page: 1,
  limit: 10,
  status: 'Active',
  search: 'keyword'
});

if (response.success) {
  const { data, pagination } = response.data;
  // data: CreditReport[]
  // pagination: { page, limit, total, totalPages }
}
```

## Type Safety

All services are fully typed using TypeScript:

```tsx
// Request types
import { LoginRequest, UserProfile } from '@/types';

// Service returns typed response
const response: ApiResponse<LoginResponse> = await authService.login({
  email: 'user@example.com',
  password: 'password'
});
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Error Handling

The axios client automatically:
1. Handles 401 errors and attempts token refresh
2. Formats errors into `ApiError` type
3. Redirects to login on auth failure
4. Logs errors for debugging

## Best Practices

1. **Always check `response.success`** before using data
2. **Use try-catch** for error handling
3. **Type your requests** using types from `@/types`
4. **Handle loading states** in components
5. **Use toast notifications** for user feedback

## Testing

Services can be easily mocked for testing:

```tsx
// Mock service
jest.mock('@/services', () => ({
  authService: {
    login: jest.fn().mockResolvedValue({
      success: true,
      data: { user: mockUser, accessToken: 'token' }
    })
  }
}));
```

