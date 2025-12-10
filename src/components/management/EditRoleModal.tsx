"use client";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { roleService, permissionService } from "@/services";
import { RoleWithPermissions, UpdateRoleRequest, Permission } from "@/types";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  role: RoleWithPermissions | null;
  onSuccess?: () => void;
}

export default function EditRoleModal({
  isOpen,
  onClose,
  roleId,
  role,
  onSuccess,
}: EditRoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
        isActive: role.isActive ?? true,
      });
      if (role.permissions) {
        setSelectedPermissions(role.permissions.map((p) => p._id || p.id || ""));
      }
    }
  }, [role]);

  useEffect(() => {
    if (isOpen) {
      loadPermissions();
    }
  }, [isOpen]);

  const loadPermissions = async () => {
    try {
      setIsLoadingPermissions(true);
      const response = await permissionService.getPermissions({ limit: 1000 });
      if (response) {
        const data = response as any;
        setAvailablePermissions(data.permissions || []);
      }
    } catch (error) {
      console.error("Failed to load permissions:", error);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    try {
      setIsSaving(true);
      const updateData: UpdateRoleRequest = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        permissions: selectedPermissions,
      };

      const response = await roleService.updateRole(roleId, updateData);

      if (response) {
        toast.success("Success", { description: "Role updated successfully" });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to update role:", error);
      toast.error("Error", {
        description: error?.response?.data?.message || "Failed to update role",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-5 lg:p-10 max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-6">
        Edit Role
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
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <Label htmlFor="isActive" className="mb-1">Active Status</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable or disable this role
            </p>
          </div>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />
        </div>

        <div>
          <Label>Permissions</Label>
          {isLoadingPermissions ? (
            <div className="mt-2 p-4 text-center text-sm text-gray-500">Loading permissions...</div>
          ) : (
            <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
              {availablePermissions.map((perm) => (
                <label
                  key={perm._id || perm.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm._id || perm.id || "")}
                    onChange={() => togglePermission(perm._id || perm.id || "")}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-800 dark:text-white/90">
                    {perm.name} ({perm.module}:{perm.action})
                  </span>
                </label>
              ))}
            </div>
          )}
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

