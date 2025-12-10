import BackupCodesPage from "@/components/auth/BackupCodesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backup Codes | CIBIL Admin Dashboard",
  description: "View and generate backup codes for two-factor authentication",
};

export default function BackupCodesPageRoute() {
  return <BackupCodesPage />;
}

