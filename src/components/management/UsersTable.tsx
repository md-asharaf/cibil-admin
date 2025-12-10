"use client";
import { useState, useEffect, useCallback } from "react";
import { userService, roleService } from "@/services";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import { UserWithRelations, RoleWithPermissions } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, RefreshCw, Search, Users } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

export default function UsersTable() {
  const [users, setUsers] = useState<UserWithRelations[]>([]);
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [isVerifiedFilter, setIsVerifiedFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: any = {
        page: currentPage,
        limit,
      };

      if (search.trim()) {
        filters.search = search.trim();
      }
      if (typeFilter) {
        filters.type = typeFilter;
      }
      if (isVerifiedFilter !== "") {
        filters.isVerified = isVerifiedFilter === "true";
      }
      if (roleFilter) {
        filters.role = roleFilter;
      }

      const response = await userService.getUsers(filters);
      
      // Debug: Log the actual response structure
      console.log("Users API Response:", response);
      
      // Axios interceptor unwraps ApiResponse
      // Backend: { statusCode, success, message, data: { users: [], pagination: {} } }
      // Axios unwraps: response.data = { users: [], pagination: {} }
      // Service returns: response.data (the unwrapped data)
      if (response) {
        const data = response as any;
        
        // Check if response has success property (still wrapped) or direct data (unwrapped)
        let usersData: any[] = [];
        let paginationData: any = null;
        
        if (data.success !== undefined) {
          // Still wrapped in ApiResponse
          usersData = data.data?.users || [];
          paginationData = data.data?.pagination;
        } else {
          // Already unwrapped
          usersData = data.users || [];
          paginationData = data.pagination;
        }
        
        console.log("Parsed users:", usersData, "pagination:", paginationData);
        
        setUsers(usersData);
        setTotalPages(paginationData?.pages || 1);
        setTotal(paginationData?.total || 0);
      }
    } catch (error: any) {
      console.error("Failed to load users:", error);
      toast.error("Error", { description: "Failed to load users" });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, search, typeFilter, isVerifiedFilter, roleFilter]);

  const loadRoles = useCallback(async () => {
    try {
      const response = await roleService.getRoles({ isActive: true });
      // Axios interceptor unwraps ApiResponse, so response is already the data object
      if (response) {
        const data = response as any;
        const rolesData = data.roles || [];
        setRoles(rolesData);
      }
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRefresh = () => {
    loadUsers();
    toast.success("Refreshed", { description: "User list updated" });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getUserInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Filters and Search */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 w-full min-w-[200px]">
            <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </span>
            <Input
              type="text"
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={handleSearch}
              className="pl-12 w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              options={[
                { value: "", label: "All Types" },
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
              ]}
              placeholder="Type"
              defaultValue={typeFilter}
              onChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[150px]"
            />

            <Select
              options={[
                { value: "", label: "All Status" },
                { value: "true", label: "Verified" },
                { value: "false", label: "Not Verified" },
              ]}
              placeholder="Verification"
              defaultValue={isVerifiedFilter}
              onChange={(value) => {
                setIsVerifiedFilter(value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[150px]"
            />

            <Select
              options={[
                { value: "", label: "All Roles" },
                ...roles.map((role) => ({
                  value: role._id,
                  label: role.name,
                })),
              ]}
              placeholder="Role"
              defaultValue={roleFilter}
              onChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[150px]"
            />

            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              size="sm"
              startIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Contact
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Role
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    2FA
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-5 py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          No users found
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {search || typeFilter || isVerifiedFilter || roleFilter
                            ? "Try adjusting your filters"
                            : "No users in the system"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id || user.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/images/user/owner.jpg" alt={user.name} />
                            <AvatarFallback>{getUserInitials(user.name || "")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {user.name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              ID: {user._id || user.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex flex-col gap-1">
                          {user.email && (
                            <span className="text-theme-xs">{user.email}</span>
                          )}
                          {user.phone && (
                            <span className="text-theme-xs">{user.phone}</span>
                          )}
                          {!user.email && !user.phone && (
                            <span className="text-theme-xs text-gray-400">No contact</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge
                          variant="light"
                          color={user.type === "admin" ? "primary" : "light"}
                          size="sm"
                        >
                          {user.type || "user"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.role ? (
                          typeof user.role === "object" ? (
                            <span>{user.role.name}</span>
                          ) : (
                            <span>{user.role}</span>
                          )
                        ) : (
                          <span className="text-gray-400">No role</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge
                          variant="light"
                          color={user.isVerified ? "success" : "warning"}
                          size="sm"
                        >
                          {user.isVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge
                          variant="light"
                          color={user.twoFactorEnabled ? "success" : "error"}
                          size="sm"
                        >
                          {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <UserActionsDropdown userId={user._id || user.id || ""} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} users
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

function UserActionsDropdown({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-[180px]">
        <DropdownItem tag="a" href={`/users/${userId}`} onItemClick={() => setIsOpen(false)}>
          View Details
        </DropdownItem>
        <DropdownItem tag="a" href={`/users/${userId}/edit`} onItemClick={() => setIsOpen(false)}>
          Edit User
        </DropdownItem>
      </Dropdown>
    </div>
  );
}

