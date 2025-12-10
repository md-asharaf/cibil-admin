import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify OTP | CIBIL Admin Dashboard",
  description: "Verify your OTP to complete registration or login",
};

export default function VerifyOtpPage() {
  return <VerifyOtpForm />;
}

