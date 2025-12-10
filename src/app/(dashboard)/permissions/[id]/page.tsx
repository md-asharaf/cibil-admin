"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { permissionService } from "@/services";
import { Permission } from "@/types";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { ArrowLeft, Edit, Shield, Calendar, Key } from "lucide-react";
import EditPermissionModal from "@/components/management/EditPermissionModal";

export default function PermissionViewPage() {
  const params = useParams();
  const router = useRouter();
  const permissionId = params.id as string;
  const [permission, setPermission] = useState<Permission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (permissionId) {
      loadPermission();
    }
  }, [permissionId]);

  const loadPermission = async () => {
    try {
      setIsLoading(true);
      const response = await permissionService.getPermissionById(permissionId);
      
      if (response) {
        const data = response as any;
        const permData = data.permission || data;
        setPermission(permData);
      }
    } catch (error: any) {
      console.error("Failed to load permission:", error);
      toast.error("Error", { description: "Failed to load permission details" });
      router.push("/permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionUpdated = () => {
    loadPermission();
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="Permission Details" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (!permission) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="Permission Details" />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Permission not found</p>
          <Button onClick={() => router.push("/permissions")} variant="outline" size="sm">
            Back to Permissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Permission Details" />
      
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/permissions")}
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            startIcon={<Edit className="w-4 h-4" />}
            size="sm"
          >
            Edit Permission
          </Button>
        </div>

        {/* Permission Info Card */}
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                  {permission.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="light" color={permission.isActive ? "success" : "error"} size="sm">
                    {permission.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="light" color="info" size="sm">
                    {permission.module}
                  </Badge>
                  <Badge variant="light" color="primary" size="sm">
                    {permission.action}
                  </Badge>
                </div>
              </div>
            </div>

            {permission.description && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{permission.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Key className="w-4 h-4" /> Permission ID
                </label>
                <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{permission._id || permission.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Module
                </label>
                <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{permission.module}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Action</label>
                <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{permission.action}</p>
              </div>
              {permission.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Created At
                  </label>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white/90">
                    {new Date(permission.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {permission.fields && permission.fields.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                  Fields ({permission.fields.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {permission.fields.map((field, idx) => (
                    <Badge key={idx} variant="light" color="light" size="sm">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditPermissionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        permissionId={permissionId}
        permission={permission}
        onSuccess={handlePermissionUpdated}
      />
    </div>
  );
}


