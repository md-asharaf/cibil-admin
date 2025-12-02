/**
 * Settings Types
 */

export interface SystemSettings {
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  maintenanceMode: boolean;
  apiRateLimit: number;
  dataRetention: number;
  sessionTimeout: number;
  passwordExpiry: number;
  require2FA: boolean;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  reports: boolean;
  disputes: boolean;
  systemAlerts: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  requireStrongPassword: boolean;
}

export interface UpdateSettingsRequest {
  companyName?: string;
  supportEmail?: string;
  supportPhone?: string;
  timezone?: string;
  maintenanceMode?: boolean;
  apiRateLimit?: number;
  dataRetention?: number;
  sessionTimeout?: number;
  passwordExpiry?: number;
  require2FA?: boolean;
}

export interface UpdateNotificationSettingsRequest {
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  reports?: boolean;
  disputes?: boolean;
  systemAlerts?: boolean;
}

