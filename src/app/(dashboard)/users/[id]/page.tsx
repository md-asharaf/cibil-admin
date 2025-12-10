"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userService } from "@/services";
import { UserWithRelations } from "@/types";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { ArrowLeft, Edit, Mail, Phone, Shield, User as UserIcon, Calendar, CheckCircle, XCircle } from "lucide-react";
import EditUserModal from "@/components/management/EditUserModal";

export default function UserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    loadUser();
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="User Details" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <PageBreadcrumb pageTitle="User Details" />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">User not found</p>
          <Button onClick={() => router.push("/users")} variant="outline" size="sm">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="User Details" />
      
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/users")}
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            startIcon={<Edit className="w-4 h-4" />}
            size="sm"
          >
            Edit User
          </Button>
        </div>

        {/* User Info Card */}
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/images/user/owner.jpg" alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center md:items-start gap-2">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{user.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="light" color={user.type === "admin" ? "primary" : "light"} size="sm">
                    {user.type || "user"}
                  </Badge>
                  <Badge variant="light" color={user.isVerified ? "success" : "warning"} size="sm">
                    {user.isVerified ? "Verified" : "Not Verified"}
                  </Badge>
                  <Badge variant="light" color={user.twoFactorEnabled ? "success" : "error"} size="sm">
                    2FA {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{user._id || user.id}</p>
                </div>
                {user.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{user.email}</p>
                  </div>
                )}
                {user.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-800 dark:text-white/90">{user.phone}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Role
                  </label>
                  <p className="mt-1 text-sm text-gray-800 dark:text-white/90">
                    {user.role ? (
                      typeof user.role === "object" ? (
                        user.role.name
                      ) : (
                        user.role
                      )
                    ) : (
                      <span className="text-gray-400">No role assigned</span>
                    )}
                  </p>
                </div>
                {user.permissions && user.permissions.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Permissions</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {user.permissions.map((perm: any, idx: number) => (
                        <Badge key={idx} variant="light" color="info" size="sm">
                          {typeof perm === "object" ? perm.name : perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {user.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Created At
                    </label>
                    <p className="mt-1 text-sm text-gray-800 dark:text-white/90">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={userId}
        user={user}
        onSuccess={handleUserUpdated}
      />
    </div>
  );
}


