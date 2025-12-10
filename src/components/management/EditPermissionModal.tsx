"use client";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { permissionService } from "@/services";
import { Permission, UpdatePermissionRequest, PermissionAction } from "@/types";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import Select from "@/components/form/Select";

interface EditPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissionId: string;
  permission: Permission | null;
  onSuccess?: () => void;
}

export default function EditPermissionModal({
  isOpen,
  onClose,
  permissionId,
  permission,
  onSuccess,
}: EditPermissionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    module: "",
    action: PermissionAction.READ,
    description: "",
    fields: [] as string[],
    isActive: true,
  });
  const [fieldsInput, setFieldsInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    module?: string;
  }>({});

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || "",
        module: permission.module || "",
        action: permission.action || PermissionAction.READ,
        description: permission.description || "",
        fields: permission.fields || [],
        isActive: permission.isActive ?? true,
      });
      setFieldsInput((permission.fields || []).join(", "));
    }
  }, [permission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.module.trim()) {
      newErrors.module = "Module is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Parse fields from comma-separated string
    const fields = fieldsInput
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    try {
      setIsSaving(true);
      const updateData: UpdatePermissionRequest = {
        name: formData.name,
        module: formData.module,
        action: formData.action,
        description: formData.description,
        fields: fields,
        isActive: formData.isActive,
      };

      const response = await permissionService.updatePermission(permissionId, updateData);

      if (response) {
        toast.success("Success", { description: "Permission updated successfully" });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to update permission:", error);
      toast.error("Error", {
        description: error?.response?.data?.message || "Failed to update permission",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-5 lg:p-10">
      <h2 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-6">
        Edit Permission
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
          <Label htmlFor="module">Module *</Label>
          <Input
            id="module"
            type="text"
            value={formData.module}
            onChange={(e) => setFormData({ ...formData, module: e.target.value })}
            error={!!errors.module}
            hint={errors.module}
          />
        </div>

        <div>
          <Label htmlFor="action">Action *</Label>
          <Select
            id="action"
            options={[
              { value: PermissionAction.READ, label: "Read" },
              { value: PermissionAction.UPDATE, label: "Update" },
              { value: PermissionAction.MANAGE, label: "Manage" },
              { value: PermissionAction.ALL, label: "All" },
            ]}
            value={formData.action}
            onChange={(value) =>
              setFormData({ ...formData, action: value as PermissionAction })
            }
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

        <div>
          <Label htmlFor="fields">Fields (comma-separated)</Label>
          <Input
            id="fields"
            type="text"
            value={fieldsInput}
            onChange={(e) => setFieldsInput(e.target.value)}
            placeholder="field1, field2, field3"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter field names separated by commas
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div>
            <Label htmlFor="isActive" className="mb-1">Active Status</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable or disable this permission
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

