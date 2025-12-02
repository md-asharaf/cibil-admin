'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Save, Bell, Shield, Database, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/services";
import { SystemSettings, NotificationSettings, SecuritySettings, UpdateSettingsRequest, UpdateNotificationSettingsRequest } from "@/types";

export default function SettingsPage() {
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: systemSettings, isLoading: loadingSystem } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const response = await settingsService.getSystemSettings();
      return response.success ? response.data : null;
    },
  });

  const { data: notificationSettings, isLoading: loadingNotifications } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const response = await settingsService.getNotificationSettings();
      return response.success ? response.data : null;
    },
  });

  const { data: securitySettings, isLoading: loadingSecurity } = useQuery({
    queryKey: ['security-settings'],
    queryFn: async () => {
      const response = await settingsService.getSecuritySettings();
      return response.success ? response.data : null;
    },
  });

  // Local state initialized from queries
  const [system, setSystem] = useState<SystemSettings>({
    companyName: "CIBIL Credit Information",
    supportEmail: "support@cibil.com",
    supportPhone: "+91 1800-XXX-XXXX",
    timezone: "Asia/Kolkata",
    maintenanceMode: false,
    apiRateLimit: 1000,
    dataRetention: 365,
    sessionTimeout: 30,
    passwordExpiry: 90,
    require2FA: true,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    reports: true,
    disputes: false,
    systemAlerts: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    requireStrongPassword: true,
  });

  // Update local state when queries load
  useEffect(() => {
    if (systemSettings) {
      setSystem(systemSettings);
    }
  }, [systemSettings]);

  useEffect(() => {
    if (notificationSettings) {
      setNotifications(notificationSettings);
    }
  }, [notificationSettings]);

  useEffect(() => {
    if (securitySettings) {
      setSecurity(securitySettings);
    }
  }, [securitySettings]);

  // Save general settings mutation
  const saveGeneralMutation = useMutation({
    mutationFn: (data: UpdateSettingsRequest) => settingsService.updateSystemSettings(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData(['system-settings'], response.data);
        setSystem(response.data);
        toast.success("General settings saved", {
          description: "Your changes have been applied"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to save settings", {
        description: error?.message || "Could not update general settings"
      });
    },
  });

  // Save notification settings mutation
  const saveNotificationsMutation = useMutation({
    mutationFn: (data: UpdateNotificationSettingsRequest) => settingsService.updateNotificationSettings(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData(['notification-settings'], response.data);
        setNotifications(response.data);
        toast.success("Notification settings saved", {
          description: "Your preferences have been updated"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to save settings", {
        description: error?.message || "Could not update notification settings"
      });
    },
  });

  // Save security settings mutation
  const saveSecurityMutation = useMutation({
    mutationFn: (data: Partial<SecuritySettings>) => settingsService.updateSecuritySettings(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData(['security-settings'], response.data);
        setSecurity(response.data);
        toast.success("Security settings saved", {
          description: "Security configuration has been updated"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to save settings", {
        description: error?.message || "Could not update security settings"
      });
    },
  });

  // Save system settings mutation
  const saveSystemMutation = useMutation({
    mutationFn: (data: UpdateSettingsRequest) => settingsService.updateSystemSettings(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData(['system-settings'], response.data);
        setSystem(response.data);
        toast.success("System settings saved", {
          description: "System configuration has been updated"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to save settings", {
        description: error?.message || "Could not update system settings"
      });
    },
  });

  const handleSaveGeneral = () => {
    saveGeneralMutation.mutate({
      companyName: system.companyName,
      supportEmail: system.supportEmail,
      supportPhone: system.supportPhone,
      timezone: system.timezone,
    });
  };

  const handleSaveNotifications = () => {
    saveNotificationsMutation.mutate(notifications);
  };

  const handleSaveSecurity = () => {
    saveSecurityMutation.mutate(security);
  };

  const handleSaveSystem = () => {
    saveSystemMutation.mutate({
      maintenanceMode: system.maintenanceMode,
      apiRateLimit: system.apiRateLimit,
      dataRetention: system.dataRetention,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage system settings and configurations
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">General</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Security</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">System</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">General Settings</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Basic system configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">Company Name</Label>
                  <Input 
                    id="company-name" 
                    value={system.companyName}
                    onChange={(e) => setSystem({ ...system, companyName: e.target.value })}
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email" className="text-sm font-medium text-gray-700">Support Email</Label>
                  <Input 
                    id="support-email" 
                    type="email" 
                    value={system.supportEmail}
                    onChange={(e) => setSystem({ ...system, supportEmail: e.target.value })}
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone" className="text-sm font-medium text-gray-700">Support Phone</Label>
                  <Input 
                    id="support-phone" 
                    value={system.supportPhone}
                    onChange={(e) => setSystem({ ...system, supportPhone: e.target.value })}
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
                  <Input 
                    id="timezone" 
                    value={system.timezone}
                    onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400" 
                  />
                </div>
                <Button 
                  onClick={handleSaveGeneral}
                  disabled={saveGeneralMutation.isPending || loadingSystem}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  {saveGeneralMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Configure notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-900">Email Notifications</Label>
                    <p className="text-xs text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-900">SMS Notifications</Label>
                    <p className="text-xs text-gray-500">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, sms: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-900">Push Notifications</Label>
                    <p className="text-xs text-gray-500">
                      Receive push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-900">Report Alerts</Label>
                    <p className="text-xs text-gray-500">
                      Get alerts for new credit reports
                    </p>
                  </div>
                  <Switch
                    checked={notifications.reports}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, reports: checked })
                    }
                  />
                </div>
                <Button 
                  onClick={handleSaveNotifications}
                  disabled={saveNotificationsMutation.isPending || loadingNotifications}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  {saveNotificationsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Configure security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-900">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSecurity({ ...security, twoFactorEnabled: checked })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout" className="text-sm font-medium text-gray-700">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) =>
                      setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) || 30 })
                    }
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-expiry" className="text-sm font-medium text-gray-700">Password Expiry (days)</Label>
                  <Input
                    id="password-expiry"
                    type="number"
                    value={security.passwordExpiry}
                    onChange={(e) =>
                      setSecurity({ ...security, passwordExpiry: parseInt(e.target.value) || 90 })
                    }
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>
                <Button 
                  onClick={handleSaveSecurity}
                  disabled={saveSecurityMutation.isPending || loadingSecurity}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  {saveSecurityMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  System configuration and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-gray-900">Maintenance Mode</Label>
                    <p className="text-xs text-gray-500">
                      Enable maintenance mode (system will be unavailable)
                    </p>
                  </div>
                  <Switch
                    checked={system.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSystem({ ...system, maintenanceMode: checked })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-rate-limit" className="text-sm font-medium text-gray-700">API Rate Limit (requests/hour)</Label>
                  <Input
                    id="api-rate-limit"
                    type="number"
                    value={system.apiRateLimit}
                    onChange={(e) =>
                      setSystem({ ...system, apiRateLimit: parseInt(e.target.value) || 1000 })
                    }
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-retention" className="text-sm font-medium text-gray-700">Data Retention Period (days)</Label>
                  <Input
                    id="data-retention"
                    type="number"
                    value={system.dataRetention}
                    onChange={(e) =>
                      setSystem({ ...system, dataRetention: parseInt(e.target.value) || 365 })
                    }
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Danger Zone</h3>
                  <div className="space-y-2">
                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white shadow-sm">
                      <Database className="mr-2 h-4 w-4" />
                      Clear All Data
                    </Button>
                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white shadow-sm">
                      <Lock className="mr-2 h-4 w-4" />
                      Reset System
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleSaveSystem}
                  disabled={saveSystemMutation.isPending || loadingSystem}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  {saveSystemMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
