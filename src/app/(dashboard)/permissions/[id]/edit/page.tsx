"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { permissionService } from "@/services";
import { Permission } from "@/types";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditPermissionModal from "@/components/management/EditPermissionModal";

export default function EditPermissionPage() {
  const params = useParams();
  const router = useRouter();
  const permissionId = params.id as string;
  const [permission, setPermission] = useState<Permission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    router.push(`/permissions/${permissionId}`);
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Permission" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (!permission) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Permission" />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-500 dark:text-gray-400">Permission not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Permission" />
      <EditPermissionModal
        isOpen={true}
        onClose={() => router.push(`/permissions/${permissionId}`)}
        permissionId={permissionId}
        permission={permission}
        onSuccess={handlePermissionUpdated}
      />
    </div>
  );
}


