import Verify2FAForm from "@/components/auth/Verify2FAForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify 2FA | CIBIL Admin Dashboard",
  description: "Verify your 2FA code to complete login",
};

export default function Verify2FAPage() {
  return <Verify2FAForm />;
}

