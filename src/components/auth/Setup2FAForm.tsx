"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { toast } from "sonner";
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function Setup2FAForm() {
  const [qrCode, setQrCode] = useState<string>("");
  const [manualKey, setManualKey] = useState<string>("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupLoading, setIsSetupLoading] = useState(false);
  const [errors, setErrors] = useState<{ code?: string }>({});
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [showManualKey, setShowManualKey] = useState(false);
  
  const router = useRouter();

  const handleStartSetup = async () => {
    setIsSetupLoading(true);
    try {
      const response = await authService.twoFASetup();
      if (response.success && response.data) {
        setQrCode(response.data.qrCode);
        setManualKey(response.data.manualKey);
        setStep("verify");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to setup 2FA";
      toast.error("Setup failed", { description: errorMessage });
      if (error?.response?.data?.message?.includes("already enabled")) {
        router.push("/settings/2fa");
      }
    } finally {
      setIsSetupLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setCode(digitsOnly);
    if (errors.code) setErrors({});
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setErrors({ code: "Please enter a valid 6-digit code" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.twoFAVerify({ code });
      if (response.success) {
        toast.success("2FA Enabled", { description: "Two-factor authentication has been enabled successfully" });
        router.push("/settings/2fa/backup-codes");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Invalid code";
      toast.error("Verification failed", { description: errorMessage });
      setErrors({ code: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "setup") {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="Setup Two-Factor Authentication" />
        
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
              Setup Two-Factor Authentication
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the button below to start the 2FA setup process. You'll need Google Authenticator app installed on your device.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-brand-800 dark:text-brand-300 mb-2">
                Before you start:
              </h3>
              <ul className="text-sm text-brand-700 dark:text-brand-400 space-y-1 list-disc list-inside">
                <li>Make sure you have Google Authenticator installed on your device</li>
                <li>You'll need to scan a QR code or enter a manual key</li>
                <li>Have your device ready to receive the verification code</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleStartSetup}
                disabled={isSetupLoading}
                size="sm"
              >
                {isSetupLoading ? "Starting Setup..." : "Start Setup"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSetupLoading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="Setup Two-Factor Authentication" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Setting up 2FA...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Setup Two-Factor Authentication" />
      
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Setup Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Scan the QR code with Google Authenticator or enter the manual key
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
        {/* QR Code */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-theme-xs">
            {qrCode && (
              <Image
                src={qrCode}
                alt="2FA QR Code"
                width={200}
                height={200}
                className="w-48 h-48"
              />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
            Scan this QR code with Google Authenticator app
          </p>
        </div>

        {/* Manual Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Manual Entry Key</Label>
            <button
              type="button"
              onClick={() => setShowManualKey(!showManualKey)}
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              {showManualKey ? "Hide" : "Show"} Key
            </button>
          </div>
          {showManualKey && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all flex-1">
                  {manualKey}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(manualKey);
                    toast.success("Key copied to clipboard");
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Copy key"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If you can't scan the QR code, enter this key manually in your authenticator app
          </p>
        </div>

        {/* Verify Code */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label htmlFor="code">
              Enter Verification Code <span className="text-error-500">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              error={!!errors.code}
              hint={errors.code}
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Enter the 6-digit code from your authenticator app to verify and enable 2FA
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="flex-1"
              size="sm"
            >
              {isLoading ? "Verifying..." : "Verify & Enable"}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

