import RolesTable from "@/components/management/RolesTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles Management | CIBIL Admin Dashboard",
  description: "Manage roles and their permissions",
};

export default function RolesPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Roles Management" />
      <RolesTable />
    </div>
  );
}

