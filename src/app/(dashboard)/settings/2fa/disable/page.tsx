import Disable2FAForm from "@/components/auth/Disable2FAForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disable 2FA | CIBIL Admin Dashboard",
  description: "Disable two-factor authentication for your account",
};

export default function Disable2FAPage() {
  return <Disable2FAForm />;
}

