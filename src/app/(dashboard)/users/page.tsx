import UsersTable from "@/components/management/UsersTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Management | CIBIL Admin Dashboard",
  description: "Manage users, roles, and permissions",
};

export default function UsersPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Users Management" />
      <UsersTable />
    </div>
  );
}

