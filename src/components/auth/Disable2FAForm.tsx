"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { toast } from "sonner";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function Disable2FAForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string }>({});
  
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!password) {
      setErrors({ password: "Password is required" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.twoFADisable({ password });
      if (response.success) {
        toast.success("2FA Disabled", { description: "Two-factor authentication has been disabled successfully" });
        router.push("/settings/2fa");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to disable 2FA";
      toast.error("Disable failed", { description: errorMessage });
      if (error?.response?.data?.message?.includes("password") || error?.response?.data?.message?.includes("Password")) {
        setErrors({ password: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Disable Two-Factor Authentication" />
      
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            Disable Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your password to disable 2FA. This will remove all backup codes.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="password">
              Password <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                error={!!errors.password}
                hint={errors.password}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
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
              disabled={isLoading || !password}
              className="flex-1"
              size="sm"
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

