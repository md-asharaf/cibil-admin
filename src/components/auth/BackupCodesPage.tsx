"use client";
import Button from "@/components/ui/button/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function BackupCodesPage() {
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [maskedCodes, setMaskedCodes] = useState<{ code: string; used: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCodes, setShowCodes] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    loadBackupCodes();
  }, []);

  const loadBackupCodes = async () => {
    setIsLoading(true);
    try {
      const response = await authService.getBackupCodes();
      if (response.success && response.data) {
        setMaskedCodes(response.data.backupCodes);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load backup codes";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!confirm("Generating new backup codes will invalidate all existing codes. Continue?")) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await authService.generateBackupCodes();
      if (response.success && response.data) {
        setBackupCodes(response.data.backupCodes);
        setShowCodes(true);
        toast.success("Backup codes generated", { 
          description: "Please save these codes in a safe place. They won't be shown again." 
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to generate backup codes";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const downloadCodes = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Codes downloaded");
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Backup Codes" />
      
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Backup Codes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Backup codes can be used to access your account if you lose access to your authenticator app.
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
        {/* Generate New Codes */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-1">
              Generate New Codes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generate a new set of backup codes. This will invalidate all existing codes.
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="sm"
          >
            {isGenerating ? "Generating..." : "Generate Codes"}
          </Button>
        </div>

        {/* New Codes Display */}
        {showCodes && backupCodes.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-medium text-gray-800 dark:text-white">
                  Your Backup Codes
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadCodes}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                    title="Download codes"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-xs text-error-500 mb-4">
                ⚠️ Save these codes now! They won't be shown again.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                    {code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(code)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Copy code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Codes */}
        {!showCodes && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">
              Existing Backup Codes
            </h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
              </div>
            ) : maskedCodes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {maskedCodes.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      item.used
                        ? "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                      {item.code}
                    </code>
                    {item.used && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Used)</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No backup codes available. Generate new codes to get started.
              </p>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

