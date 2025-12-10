"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userService } from "@/services";
import { UserWithRelations } from "@/types";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditUserModal from "@/components/management/EditUserModal";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserById(userId);
      
      if (response) {
        const data = response as any;
        const userData = data.user || data;
        setUser(userData);
      }
    } catch (error: any) {
      console.error("Failed to load user:", error);
      toast.error("Error", { description: "Failed to load user details" });
      router.push("/users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdated = () => {
    router.push(`/users/${userId}`);
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit User" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit User" />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-500 dark:text-gray-400">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit User" />
      <EditUserModal
        isOpen={true}
        onClose={() => router.push(`/users/${userId}`)}
        userId={userId}
        user={user}
        onSuccess={handleUserUpdated}
      />
    </div>
  );
}


