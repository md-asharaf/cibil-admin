"use client";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { userService } from "@/services";
import { UserWithRelations, UpdateUserRequest } from "@/types";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  user: UserWithRelations | null;
  onSuccess?: () => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  userId,
  user,
  onSuccess,
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    isVerified: false,
    twoFactorEnabled: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        isVerified: user.isVerified || false,
        twoFactorEnabled: user.twoFactorEnabled || false,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      const updateData: UpdateUserRequest = {
        name: formData.name,
        ...(formData.email && { email: formData.email }),
        ...(formData.phone && { phone: formData.phone }),
        isVerified: formData.isVerified,
        twoFactorEnabled: formData.twoFactorEnabled,
      };

      const response = await userService.updateUser(userId, updateData);

      if (response) {
        toast.success("Success", { description: "User updated successfully" });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to update user:", error);
      toast.error("Error", {
        description: error?.response?.data?.message || "Failed to update user",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-5 lg:p-10">
      <h2 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-6">
        Edit User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            hint={errors.name}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            hint={errors.email}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={!!errors.phone}
            hint={errors.phone}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <Label htmlFor="isVerified" className="mb-1">Verified Status</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mark user as verified
            </p>
          </div>
          <Switch
            id="isVerified"
            checked={formData.isVerified}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isVerified: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <Label htmlFor="twoFactorEnabled" className="mb-1">2FA Enabled</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable two-factor authentication
            </p>
          </div>
          <Switch
            id="twoFactorEnabled"
            checked={formData.twoFactorEnabled}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, twoFactorEnabled: checked })
            }
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-8">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

