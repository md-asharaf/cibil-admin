"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { toast } from "sonner";

type LoginMode = "password" | "otp";
type IdentifierType = "email" | "phone";

export default function SignInForm() {
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [identifierType, setIdentifierType] = useState<IdentifierType>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string; otp?: string }>({});
  
  const { login, verifyOtp } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { emailOrPhone?: string; password?: string; otp?: string } = {};
    
    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = `${identifierType === "email" ? "Email" : "Phone"} is required`;
    } else {
      if (identifierType === "email") {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone.trim());
        if (!isEmail) {
          newErrors.emailOrPhone = "Please enter a valid email address";
        }
      } else {
        const isPhone = /^[\d\s\-\+\(\)]+$/.test(emailOrPhone.trim()) && emailOrPhone.trim().replace(/\D/g, "").length >= 8;
        if (!isPhone) {
          newErrors.emailOrPhone = "Please enter a valid phone number";
        }
      }
    }
    
    if (loginMode === "password") {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    } else {
      if (!otp || otp.length !== 6) {
        newErrors.otp = "Please enter a valid 6-digit OTP";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!emailOrPhone.trim()) {
      setErrors({ emailOrPhone: `${identifierType === "email" ? "Email" : "Phone"} is required` });
      return;
    }

    if (identifierType === "email") {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone.trim());
      if (!isEmail) {
        setErrors({ emailOrPhone: "Please enter a valid email address" });
        return;
      }
    } else {
      const isPhone = /^[\d\s\-\+\(\)]+$/.test(emailOrPhone.trim()) && emailOrPhone.trim().replace(/\D/g, "").length >= 8;
      if (!isPhone) {
        setErrors({ emailOrPhone: "Please enter a valid phone number" });
        return;
      }
    }

    setIsSendingOtp(true);
    setErrors({});

    try {
      const response = await authService.sendOtp(
        identifierType === "email"
          ? { email: emailOrPhone.trim() }
          : { phone: emailOrPhone.trim() }
      );

      if (response.success) {
        setOtpSent(true);
        // Store email/phone for OTP verification
        if (typeof window !== "undefined") {
          sessionStorage.setItem("login_emailOrPhone", emailOrPhone.trim());
          sessionStorage.setItem("login_identifierType", identifierType);
        }
        toast.success("OTP sent", { description: "Please check your email or phone for the OTP code" });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to send OTP";
      toast.error("Failed to send OTP", { description: errorMessage });
      setErrors({ emailOrPhone: errorMessage });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (loginMode === "password") {
        await login(emailOrPhone.trim(), password);
      } else {
        // OTP login
        if (!otpSent) {
          await handleSendOtp();
          setIsLoading(false);
          return;
        }
        await verifyOtp(emailOrPhone.trim(), otp);
      }
      // Navigation is handled by auth context
    } catch (error: any) {
      // Error is already handled by auth context with toast
      if (error?.message) {
        if (error.message.includes("email") || error.message.includes("phone")) {
          setErrors({ emailOrPhone: error.message });
        } else if (error.message.includes("password")) {
          setErrors({ password: error.message });
        } else if (error.message.includes("OTP") || error.message.includes("otp")) {
          setErrors({ otp: error.message });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setOtp(digitsOnly);
    if (errors.otp) setErrors({ ...errors, otp: undefined });
  };

  const switchLoginMode = (mode: LoginMode) => {
    setLoginMode(mode);
    setPassword("");
    setOtp("");
    setOtpSent(false);
    setErrors({});
  };

  const switchIdentifierType = (type: IdentifierType) => {
    setIdentifierType(type);
    setEmailOrPhone("");
    setOtpSent(false);
    setErrors({});
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loginMode === "password" 
                ? `Enter your ${identifierType} and password to sign in!`
                : `Enter your ${identifierType} to receive an OTP code`}
            </p>
          </div>
          <div>
            {/* Login Mode Toggle */}
            <div className="mb-6">
              <div className="flex items-center gap-4 p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
                <button
                  type="button"
                  onClick={() => switchLoginMode("password")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    loginMode === "password"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => switchLoginMode("otp")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    loginMode === "otp"
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  OTP
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="emailOrPhone">
                    {identifierType === "email" ? "Email" : "Phone"} <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type={identifierType === "email" ? "email" : "tel"}
                    placeholder={identifierType === "email" ? "email@example.com" : "+1234567890"}
                    value={emailOrPhone}
                    onChange={(e) => {
                      setEmailOrPhone(e.target.value);
                      if (errors.emailOrPhone) setErrors({ ...errors, emailOrPhone: undefined });
                    }}
                    error={!!errors.emailOrPhone}
                    hint={errors.emailOrPhone}
                  />
                </div>
                {loginMode === "password" ? (
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
                ) : (
                  <>
                    {otpSent && (
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
                        />
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp}
                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                          >
                            {isSendingOtp ? "Sending..." : "Resend OTP"}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {loginMode === "password" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                        Keep me logged in
                      </span>
                    </div>
                    <Link
                      href="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
                <div>
                  <Button 
                    type="submit"
                    disabled={isLoading || isSendingOtp || (loginMode === "otp" && !emailOrPhone.trim())}
                    className="w-full"
                    size="sm"
                  >
                    {isLoading || isSendingOtp
                      ? (loginMode === "password" ? "Signing in..." : isSendingOtp ? "Sending OTP..." : "Verifying...")
                      : (loginMode === "password" ? "Sign in" : otpSent ? "Verify OTP" : "Send OTP")
                    }
                  </Button>
                </div>
              </div>
            </form>

            {/* Email/Phone Switch Button - Below Login Button */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => switchIdentifierType(identifierType === "email" ? "phone" : "email")}
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors"
              >
                Use {identifierType === "email" ? "Phone" : "Email"} instead
              </button>
            </div>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Need an account? Contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

