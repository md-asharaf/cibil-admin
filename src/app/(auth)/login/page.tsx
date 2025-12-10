import SignInForm from "@/components/auth/SignInForm";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CIBIL Admin Dashboard",
  description: "Sign in to your CIBIL Admin Dashboard account",
};

export default function LoginPage() {
  return (
    <PublicRoute>
      <SignInForm />
    </PublicRoute>
  );
}

