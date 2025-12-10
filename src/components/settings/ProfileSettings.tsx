"use client";
import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services";
import { toast } from "sonner";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { User, UserWithRelations } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ProfileSettings() {
  const { user: authUser, updateUser: updateAuthUser } = useAuth();
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (authUser) {
      loadUserData();
    }
  }, [authUser]);

  const loadUserData = async () => {
    if (!authUser?._id && !authUser?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const userId = authUser._id || authUser.id || "";
      const response = await userService.getUserById(userId);
      
      if (response.success && response.data) {
        const userData = response.data as any;
        setUser(userData.user || userData);
        setFormData({
          name: userData.user?.name || userData.name || "",
          email: userData.user?.email || userData.email || "",
          phone: userData.user?.phone || userData.phone || "",
        });
      }
    } catch (error: any) {
      console.error("Failed to load user data:", error);
      toast.error("Error", { description: "Failed to load profile data" });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phone?: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && formData.phone.trim().replace(/\D/g, "").length < 8) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // At least one of email or phone must be provided
    if (!formData.email?.trim() && !formData.phone?.trim()) {
      newErrors.email = "Either email or phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!authUser?._id && !authUser?.id) {
      toast.error("Error", { description: "User not found" });
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const userId = authUser._id || authUser.id || "";
      const updateData: any = {};

      if (formData.name.trim() !== (user?.name || "")) {
        updateData.name = formData.name.trim();
      }
      if (formData.email?.trim() !== (user?.email || "")) {
        updateData.email = formData.email?.trim() || undefined;
      }
      if (formData.phone?.trim() !== (user?.phone || "")) {
        updateData.phone = formData.phone?.trim() || undefined;
      }

      // Only update if there are changes
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes", { description: "No changes to save" });
        setIsSaving(false);
        return;
      }

      const response = await userService.updateUser(userId, updateData);

      if (response.success && response.data) {
        const updatedUser = (response.data as any).user || response.data;
        setUser(updatedUser);
        
        // Update auth context user
        updateAuthUser({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        });

        toast.success("Profile updated", { description: "Your profile has been updated successfully" });
        
        // Reload user data to get latest
        await loadUserData();
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update profile";
      toast.error("Update failed", { description: errorMessage });
      
      if (error?.response?.data?.message) {
        const msg = error.response.data.message;
        if (msg.includes("email") || msg.includes("Email")) {
          setErrors({ email: msg });
        } else if (msg.includes("phone") || msg.includes("Phone")) {
          setErrors({ phone: msg });
        } else if (msg.includes("name") || msg.includes("Name")) {
          setErrors({ name: msg });
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const currentUser = user || authUser;
  const userInitials = currentUser?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div>
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mb-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              {currentUser ? (
                <span className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                  {userInitials}
                </span>
              ) : (
                <Image
                  width={80}
                  height={80}
                  src="/images/user/owner.jpg"
                  alt="user"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {currentUser?.name || "User"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentUser?.email || currentUser?.phone || "No contact info"}
                </p>
                {currentUser?.type && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {currentUser.type}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Personal Information
            </h4>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label htmlFor="name">
                    Full Name <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    error={!!errors.name}
                    hint={errors.name}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    error={!!errors.email}
                    hint={errors.email}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    error={!!errors.phone}
                    hint={errors.phone}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                At least one of email or phone is required
              </p>

              <div className="flex items-center gap-3 pt-4 lg:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (currentUser) {
                      setFormData({
                        name: currentUser.name || "",
                        email: currentUser.email || "",
                        phone: currentUser.phone || "",
                      });
                      setErrors({});
                    }
                  }}
                  disabled={isSaving}
                  size="sm"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  size="sm"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Account Information Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Account Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Account Type
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">
                  {currentUser?.type || "N/A"}
                </p>
              </div>

              {currentUser?.role && (
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {typeof currentUser.role === "object" 
                      ? currentUser.role.name 
                      : currentUser.role}
                  </p>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Verification Status
                </p>
                <div className="mt-1">
                  <Badge
                    variant="light"
                    color={currentUser?.isVerified ? "success" : "warning"}
                    size="sm"
                  >
                    {currentUser?.isVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  2FA Status
                </p>
                <div className="mt-1">
                  <Badge
                    variant="light"
                    color={currentUser?.twoFactorEnabled ? "success" : "light"}
                    size="sm"
                  >
                    {currentUser?.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              {currentUser?.createdAt && (
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 mt-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Quick Actions
            </h4>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/settings/2fa/setup" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  {currentUser?.twoFactorEnabled ? "Manage 2FA" : "Setup 2FA"}
                </Button>
              </Link>
              <Link href="/settings/2fa/backup-codes" className="flex-1">
                <Button
                  variant="outline"
                  disabled={!currentUser?.twoFactorEnabled}
                  className="w-full"
                  size="sm"
                >
                  Backup Codes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
