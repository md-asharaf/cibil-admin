import Setup2FAForm from "@/components/auth/Setup2FAForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup 2FA | CIBIL Admin Dashboard",
  description: "Enable two-factor authentication for your account",
};

export default function Setup2FAPage() {
  return <Setup2FAForm />;
}

