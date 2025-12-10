import ProfileSettings from "@/components/settings/ProfileSettings";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | CIBIL Admin Dashboard",
  description: "Update your personal information and profile settings",
};

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageBreadcrumb pageTitle="Profile Settings" />
      <ProfileSettings />
    </div>
  );
}

