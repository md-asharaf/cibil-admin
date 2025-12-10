import PermissionsTable from "@/components/management/PermissionsTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permissions Management | CIBIL Admin Dashboard",
  description: "Manage permissions and access control",
};

export default function PermissionsPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Permissions Management" />
      <PermissionsTable />
    </div>
  );
}

