"use client";
import { useState, useEffect, useCallback } from "react";
import { permissionService } from "@/services";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import { Permission, PermissionAction } from "@/types";
import { RefreshCw, MoreVertical } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

export default function PermissionsTable() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Filters
  const [isActiveFilter, setIsActiveFilter] = useState<string>("true");
  const [moduleFilter, setModuleFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");

  const loadPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: any = {
        page: currentPage,
        limit,
      };

      if (isActiveFilter !== "") {
        filters.isActive = isActiveFilter === "true";
      }
      if (moduleFilter) {
        filters.module = moduleFilter;
      }
      if (actionFilter) {
        filters.action = actionFilter;
      }

      const response = await permissionService.getPermissions(filters);
      
      console.log("Permissions API Response:", response);
      
      if (response) {
        const data = response as any;
        
        let permissionsData: any[] = [];
        let paginationData: any = null;
        
        if (data.success !== undefined) {
          // Still wrapped in ApiResponse
          permissionsData = data.data?.permissions || [];
          paginationData = data.data?.pagination;
        } else {
          // Already unwrapped
          permissionsData = data.permissions || [];
          paginationData = data.pagination;
        }
        
        console.log("Parsed permissions:", permissionsData, "pagination:", paginationData);
        
        setPermissions(permissionsData);
        setTotalPages(paginationData?.pages || 1);
        setTotal(paginationData?.total || 0);
      }
    } catch (error: any) {
      console.error("Failed to load permissions:", error);
      toast.error("Error", { description: "Failed to load permissions" });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, isActiveFilter, moduleFilter, actionFilter]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const handleRefresh = () => {
    loadPermissions();
    toast.success("Refreshed", { description: "Permission list updated" });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get unique modules from permissions
  const modules = Array.from(new Set(permissions.map((p) => p.module))).sort();

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              options={[
                { value: "", label: "All Modules" },
                ...modules.map((module) => ({
                  value: module,
                  label: module.charAt(0).toUpperCase() + module.slice(1),
                })),
              ]}
              placeholder="Module"
              defaultValue={moduleFilter}
              onChange={(value) => {
                setModuleFilter(value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[150px]"
            />

            <Select
              options={[
                { value: "", label: "All Actions" },
                { value: PermissionAction.READ, label: "Read" },
                { value: PermissionAction.UPDATE, label: "Update" },
                { value: PermissionAction.MANAGE, label: "Manage" },
                { value: PermissionAction.ALL, label: "All" },
              ]}
              placeholder="Action"
              defaultValue={actionFilter}
              onChange={(value) => {
                setActionFilter(value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[150px]"
            />

            <Select
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
                { value: "", label: "All" },
              ]}
              placeholder="Status"
              defaultValue={isActiveFilter}
              onChange={(value) => {
                setIsActiveFilter(value);
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
                    Permission Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Module
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Fields
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
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-5 py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading permissions...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : permissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No permissions found</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {moduleFilter || actionFilter || isActiveFilter !== "" ? "Try adjusting your filters" : "No permissions in the system"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  permissions.map((permission) => (
                    <TableRow key={permission._id || permission.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {permission.name}
                          </span>
                          {permission.description && (
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {permission.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge variant="light" color="primary" size="sm">
                          {permission.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge variant="light" color="info" size="sm">
                          {permission.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {permission.fields && permission.fields.length > 0 ? (
                          <span className="text-theme-xs">
                            {permission.fields.length === 1 && permission.fields[0] === "*"
                              ? "All fields"
                              : `${permission.fields.length} field${permission.fields.length !== 1 ? "s" : ""}`}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-theme-xs">No fields</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge
                          variant="light"
                          color={permission.isActive ? "success" : "error"}
                          size="sm"
                        >
                          {permission.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <PermissionActionsDropdown permissionId={permission._id || permission.id || ""} />
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
      {!isLoading && permissions.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} permissions
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

function PermissionActionsDropdown({ permissionId }: { permissionId: string }) {
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
        <DropdownItem tag="a" href={`/permissions/${permissionId}`} onItemClick={() => setIsOpen(false)}>
          View Details
        </DropdownItem>
        <DropdownItem tag="a" href={`/permissions/${permissionId}/edit`} onItemClick={() => setIsOpen(false)}>
          Edit Permission
        </DropdownItem>
      </Dropdown>
    </div>
  );
}

