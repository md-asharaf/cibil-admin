'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, MoreVertical, Mail, Phone, Shield, Ban, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";
import { toast } from "sonner";
import { UserProfile, UpdateUserRequest } from "@/types";
import { mockUsers } from "@/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusColor = (status: string) => {
  return status === "Active"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-red-50 text-red-700 border-red-200";
};

const getRoleColor = (role: string) => {
  return role === "Administrator"
    ? "bg-purple-50 text-purple-700 border-purple-200"
    : "bg-blue-50 text-blue-700 border-blue-200";
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await userService.getUsers();
        return response.success ? response.data : { data: mockUsers, pagination: { page: 1, limit: 10, total: mockUsers.length, totalPages: 1 } };
      } catch (error) {
        return { data: mockUsers, pagination: { page: 1, limit: 10, total: mockUsers.length, totalPages: 1 } };
      }
    },
  });

  const users = usersData?.data || mockUsers;

  // Fetch user stats
  const { data: statsData } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      try {
        const response = await userService.getUserStats();
        return response.success ? response.data : null;
      } catch (error) {
        return null;
      }
    },
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.createUser(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        toast.success("User created successfully", {
          description: `${response.data.name} has been added`
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to create user", {
        description: error?.message || "An error occurred while creating the user"
      });
    },
  });

  // Suspend user mutation
  const suspendMutation = useMutation({
    mutationFn: (userId: string) => userService.suspendUser(userId),
    onSuccess: (response, userId) => {
      if (response.success && response.data?.suspended) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        toast.success("User suspended", {
          description: "User account has been suspended"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to suspend user", {
        description: error?.message || "Could not suspend the user"
      });
    },
  });

  // Activate user mutation
  const activateMutation = useMutation({
    mutationFn: (userId: string) => userService.activateUser(userId),
    onSuccess: (response) => {
      if (response.success && response.data?.activated) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        toast.success("User activated", {
          description: "User account has been activated"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to activate user", {
        description: error?.message || "Could not activate the user"
      });
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (response) => {
      if (response.success && response.data?.deleted) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        toast.success("User deleted", {
          description: "User has been removed from the system"
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to delete user", {
        description: error?.message || "Could not delete the user"
      });
    },
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const activeUsers = statsData?.active || users.filter(u => (u as any).status !== "Suspended").length;
  const totalUsers = statsData?.total || users.length;

  const handleAddUser = () => {
    createMutation.mutate({
      name: "New User",
      email: `user${Date.now()}@example.com`,
      phone: "+91 00000 00000",
      department: "General"
    });
  };

  const handleSuspendUser = (userId: string) => {
    suspendMutation.mutate(userId);
  };

  const handleActivateUser = (userId: string) => {
    activateMutation.mutate(userId);
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    deleteMutation.mutate(userId);
  };

  const getUserStatus = (user: UserProfile) => {
    return (user as any).status || "Active";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">
              Manage all registered users and their accounts
            </p>
          </div>
          <Button 
            onClick={handleAddUser}
            disabled={createMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                <Shield className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">{totalUsers}</div>
              <p className="text-sm text-gray-500 mt-2">
                All registered users
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">{activeUsers}</div>
              <p className="text-sm text-gray-500 mt-2">
                Currently active accounts
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Suspended</CardTitle>
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <Ban className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-gray-900">{totalUsers - activeUsers}</div>
              <p className="text-sm text-gray-500 mt-2">
                Suspended accounts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">All Users</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {isLoading ? "Loading..." : `${filteredUsers.length} user(s) found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">User ID</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Contact</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Role</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Reports</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Last Login</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const status = getUserStatus(user);
                      const isSuspending = suspendMutation.isPending && suspendMutation.variables === user.id;
                      const isActivating = activateMutation.isPending && activateMutation.variables === user.id;
                      const isDeleting = deleteMutation.isPending && deleteMutation.variables === user.id;
                      
                      return (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-sm text-gray-900 font-medium">{user.id}</span>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-sm text-gray-900">{user.name}</div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600">{user.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${getStatusColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-sm text-gray-900">{(user as any).reportsCount || 0}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                  <MoreVertical className="h-4 w-4 text-gray-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {status === "Active" ? (
                                  <DropdownMenuItem 
                                    onClick={() => handleSuspendUser(user.id)}
                                    disabled={isSuspending}
                                  >
                                    {isSuspending ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <Ban className="mr-2 h-4 w-4" />
                                    )}
                                    Suspend User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => handleActivateUser(user.id)}
                                    disabled={isActivating}
                                  >
                                    {isActivating ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                    )}
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={isDeleting}
                                  className="text-red-600"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    "Delete User"
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
