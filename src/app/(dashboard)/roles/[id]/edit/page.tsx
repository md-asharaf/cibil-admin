"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { roleService } from "@/services";
import { RoleWithPermissions } from "@/types";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditRoleModal from "@/components/management/EditRoleModal";

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;
  const [role, setRole] = useState<RoleWithPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    router.push(`/roles/${roleId}`);
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Role" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Role" />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-500 dark:text-gray-400">Role not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Role" />
      <EditRoleModal
        isOpen={true}
        onClose={() => router.push(`/roles/${roleId}`)}
        roleId={roleId}
        role={role}
        onSuccess={handleRoleUpdated}
      />
    </div>
  );
}


