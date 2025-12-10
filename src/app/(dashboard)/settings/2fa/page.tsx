"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Shield, KeyRound, Download, Settings } from "lucide-react";
import Link from "next/link";

export default function TwoFactorAuthPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="Two-Factor Authentication" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  const is2FAEnabled = user?.twoFactorEnabled || false;

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Two-Factor Authentication" />
      
      <div className="space-y-5 sm:space-y-6">
        {/* Status Card */}
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-500/20">
                <Shield className="w-6 h-6 text-brand-500 dark:text-brand-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <Badge
              variant="light"
              color={is2FAEnabled ? "success" : "error"}
              size="sm"
            >
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          {is2FAEnabled ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Two-factor authentication is currently enabled on your account. You'll need to enter a code from your authenticator app when signing in.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Link href="/settings/2fa/backup-codes">
                  <Button variant="outline" size="sm" startIcon={<KeyRound className="w-4 h-4" />}>
                    View Backup Codes
                  </Button>
                </Link>
                <Link href="/settings/2fa/disable">
                  <Button variant="outline" size="sm" startIcon={<Settings className="w-4 h-4" />}>
                    Disable 2FA
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to enter a code from your authenticator app in addition to your password when signing in.
              </p>
              <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-brand-800 dark:text-brand-300 mb-2">
                  How it works:
                </h3>
                <ul className="text-sm text-brand-700 dark:text-brand-400 space-y-1 list-disc list-inside">
                  <li>Download Google Authenticator from Google Play Store or Apple App Store</li>
                  <li>Scan the QR code or enter the manual key</li>
                  <li>Enter the 6-digit code to verify and enable 2FA</li>
                  <li>Save your backup codes in a safe place</li>
                </ul>
              </div>
              <div className="pt-4">
                <Link href="/settings/2fa/setup">
                  <Button size="sm" startIcon={<Shield className="w-4 h-4" />}>
                    Enable Two-Factor Authentication
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90 mb-4">
            Authenticator App
          </h3>
          <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <h4 className="font-medium text-gray-800 dark:text-white/90 mb-1 text-sm">Google Authenticator</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Free and widely used authenticator app. Download from Google Play Store or Apple App Store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

