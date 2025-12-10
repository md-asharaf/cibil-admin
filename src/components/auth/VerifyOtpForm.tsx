"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { toast } from "sonner";

export default function VerifyOtpForm() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{ otp?: string }>({});
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("email");
  
  const { verifyOtp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get email/phone from session storage (set during registration or login)
    if (typeof window !== "undefined") {
      const storedEmailOrPhone = sessionStorage.getItem("registration_emailOrPhone") || 
                                 sessionStorage.getItem("login_emailOrPhone");
      const storedType = sessionStorage.getItem("registration_identifierType") || 
                        sessionStorage.getItem("login_identifierType") || "email";
      
      if (storedEmailOrPhone) {
        setEmailOrPhone(storedEmailOrPhone);
        setIdentifierType(storedType as "email" | "phone");
      } else {
        // If no stored email/phone, redirect to login
        router.push("/login");
        toast.error("Session expired", { description: "Please login again" });
      }
    }
  }, [router]);

  const handleOtpChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setOtp(digitsOnly);
    if (errors.otp) setErrors({});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await verifyOtp(emailOrPhone, otp);
      // Navigation is handled by auth context
    } catch (error: any) {
      // Error is already handled by auth context with toast
      if (error?.message) {
        if (error.message.includes("OTP") || error.message.includes("otp")) {
          setErrors({ otp: error.message });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!emailOrPhone) {
      toast.error("Error", { description: "Email or phone not found" });
      return;
    }

    setIsResending(true);
    try {
      const isEmail = identifierType === "email";
      const response = await authService.sendOtp(
        isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }
      );

      if (response.success) {
        toast.success("OTP resent", { 
          description: `OTP has been sent to your ${identifierType}` 
        });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to resend OTP";
      toast.error("Failed to resend OTP", { description: errorMessage });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to login
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Verify OTP
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the 6-digit OTP sent to your {identifierType === "email" ? "email" : "phone"}
            </p>
            {emailOrPhone && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {identifierType === "email" ? "Email" : "Phone"}: {emailOrPhone}
              </p>
            )}
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="otp">
                    Enter OTP <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    error={!!errors.otp}
                    hint={errors.otp}
                    autoFocus
                  />
                </div>
                <div>
                  <Button 
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full"
                    size="sm"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

