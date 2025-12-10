'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Shield, Save, Camera, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "@/services";
import { UpdateUserRequest, ChangePasswordRequest, getUserRoleName } from "@/types";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profileData, isLoading: loadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await userService.getProfile();
      return response.success ? response.data : null;
    },
  });

  const [profile, setProfile] = useState<UpdateUserRequest>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update local state when query loads
  useEffect(() => {
    if (profileData) {
      setProfile({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || "",
      });
    }
  }, [profileData]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData(['user-profile'], response.data);
        setProfile({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || "",
        });
        toast.success("Profile updated", {
          description: "Your profile information has been saved"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to update profile", {
        description: error?.message || "Could not save profile changes"
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => userService.changePassword(data),
    onSuccess: (response) => {
      if (response.success && response.data?.changed) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password changed", {
          description: "Your password has been updated successfully"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to change password", {
        description: error?.message || "Could not update password. Please check your current password."
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profile);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please ensure both password fields match"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters long"
      });
      return;
    }

    changePasswordMutation.mutate(passwordData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your profile information and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 border-0 shadow-sm bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="text-xl font-semibold">
                      {profile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primary hover:bg-primary/90 text-primary-foreground shadow-md h-8 w-8"
                    variant="secondary"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">{profile.name || "User"}</CardTitle>
              <CardDescription className="text-sm text-gray-600">{user ? getUserRoleName(user) : "User"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm p-3 border border-gray-200 rounded-lg bg-gray-50">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{profile.email || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-3 border border-gray-200 rounded-lg bg-gray-50">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{profile.phone || "Not provided"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Personal Information</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  disabled={loadingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  disabled={loadingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  disabled={loadingProfile}
                />
              </div>
              <Button 
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending || loadingProfile}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Change Password</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-400" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-400" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-400" 
              />
            </div>
            <Button 
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
