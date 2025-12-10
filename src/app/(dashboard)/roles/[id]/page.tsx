"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { roleService } from "@/services";
import { RoleWithPermissions } from "@/types";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { ArrowLeft, Edit, Shield, Calendar, CheckCircle, XCircle } from "lucide-react";
import EditRoleModal from "@/components/management/EditRoleModal";

export default function RoleViewPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  const [role, setRole] = useState<RoleWithPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (roleId) {
      loadRole();
    }
  }, [roleId]);

  const loadRole = async () => {
    try {
      setIsLoading(true);
      const response = await roleService.getRoleById(roleId);
      
      if (response) {
        const data = response as any;
        const roleData = data.role || data;
        setRole(roleData);
      }
    } catch (error: any) {
      console.error("Failed to load role:", error);
      toast.error("Error", { description: "Failed to load role details" });
      router.push("/roles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdated = () => {
    loadRole();
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="Role Details" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="Role Details" />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Role not found</p>
          <Button onClick={() => router.push("/roles")} variant="outline" size="sm">
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Role Details" />
      
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/roles")}
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            startIcon={<Edit className="w-4 h-4" />}
            size="sm"
          >
            Edit Role
          </Button>
        </div>

        {/* Role Info Card */}
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                  {role.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge variant="light" color={role.isActive ? "success" : "error"} size="sm">
                    {role.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {role.description && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{role.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Role ID
                </label>
                <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{role._id || role.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Path
                </label>
                <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{role.path}</p>
              </div>
              {role.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Created At
                  </label>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white/90">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {role.permissions && role.permissions.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                  Permissions ({role.permissions.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <Badge key={perm._id || perm.id} variant="light" color="info" size="sm">
                      {perm.name} ({perm.module}:{perm.action})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        roleId={roleId}
        role={role}
        onSuccess={handleRoleUpdated}
      />
    </div>
  );
}


