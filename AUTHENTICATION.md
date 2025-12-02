# Authentication System Documentation

## Overview

The CIBIL Admin Dashboard uses a **Context API-based authentication system** with JWT token management. This provides a centralized, secure, and scalable approach to managing user authentication state.

## Architecture

### 1. **Auth Context** (`src/contexts/auth-context.tsx`)

The `AuthProvider` component wraps the entire application and provides:
- **Global authentication state** accessible throughout the app
- **Token management** (JWT + refresh tokens)
- **User data persistence** in localStorage
- **Automatic token refresh** mechanism
- **Centralized auth methods** (login, logout, verify2FA)

### 2. **State Management**

#### Storage Strategy:
- **localStorage**: Stores persistent data
  - `auth_token`: JWT access token
  - `refresh_token`: Token for refreshing access token
  - `user_data`: User profile information
  - `token_expiry`: Token expiration timestamp

- **sessionStorage**: Stores session-specific data
  - `isAuthenticated`: Quick auth check flag
  - `2faEnabled`: 2FA status flag

#### Why This Approach?
- **localStorage**: Persists across browser sessions (user stays logged in)
- **sessionStorage**: Clears on tab close (better security for sensitive flags)
- **Context API**: Provides reactive state updates across components

### 3. **Authentication Flow**

```
User Login
    ↓
Auth Context: login()
    ↓
API Call (Mock currently)
    ↓
Store tokens in localStorage
    ↓
Set user state in context
    ↓
Check 2FA status
    ↓
Redirect to / or /2fa/verify
```

### 4. **Route Protection**

The dashboard layout (`src/app/(dashboard)/layout.tsx`) uses:
- `useAuth()` hook to check authentication
- Loading state while verifying auth
- Automatic redirect to `/login` if not authenticated
- Prevents flash of protected content

## Usage

### Using Auth in Components

```tsx
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Available Auth Methods

```tsx
const {
  user,              // User object or null
  isAuthenticated,   // Boolean
  isLoading,        // Boolean (during auth check)
  login,            // (email, password) => Promise
  loginWithOTP,     // (email, otp) => Promise
  verify2FA,        // (code) => Promise
  logout,           // () => void
  refreshToken,     // () => Promise
} = useAuth();
```

## Security Features

### Current Implementation:
1. ✅ **Token-based authentication** (JWT)
2. ✅ **Token expiration** checking
3. ✅ **Automatic token refresh** mechanism
4. ✅ **Route protection** middleware
5. ✅ **Centralized logout** (clears all auth data)
6. ✅ **2FA support** integration

### Production Recommendations:

1. **API Integration**: Replace mock API calls with real endpoints
   ```tsx
   // In auth-context.tsx
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password }),
   });
   ```

2. **HttpOnly Cookies**: For better security, consider storing tokens in httpOnly cookies instead of localStorage
   ```tsx
   // Server-side cookie setting
   res.cookie('auth_token', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict',
   });
   ```

3. **Token Refresh Interceptor**: Add axios/fetch interceptor for automatic token refresh on 401 errors

4. **CSRF Protection**: Add CSRF tokens for state-changing operations

5. **Rate Limiting**: Implement rate limiting on login endpoints

6. **Session Management**: Add server-side session validation

## Migration from sessionStorage

The old implementation used only `sessionStorage.getItem("isAuthenticated")`. The new system:
- ✅ Maintains backward compatibility
- ✅ Adds proper token management
- ✅ Provides user data throughout the app
- ✅ Enables automatic token refresh
- ✅ Better error handling

## Testing Authentication

### Manual Testing:
1. Login with credentials
2. Check localStorage for tokens
3. Verify user state in context
4. Test logout (should clear all data)
5. Test token expiration handling
6. Test 2FA flow

### Mock Data:
Currently using mock API responses. Replace with actual API calls when backend is ready.

## Troubleshooting

### Issue: "useAuth must be used within an AuthProvider"
**Solution**: Ensure `AuthProvider` wraps your app in `src/app/layout.tsx`

### Issue: User not persisting after refresh
**Solution**: Check localStorage permissions and token expiry

### Issue: Infinite redirect loop
**Solution**: Ensure auth check completes before redirecting

## Next Steps

1. **Backend Integration**: Connect to real authentication API
2. **Token Refresh**: Implement automatic refresh before expiry
3. **Error Handling**: Add comprehensive error messages
4. **Loading States**: Improve loading indicators
5. **Session Timeout**: Add automatic logout on inactivity
6. **Multi-tab Sync**: Sync auth state across browser tabs

