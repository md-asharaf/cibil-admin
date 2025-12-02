'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { OTPInput } from "../input-otp";
import { useAuth } from "@/contexts/auth-context";

export default function Verify2FA() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { verify2FA } = useAuth();

    const handleVerify = async (code: string) => {
        setLoading(true);
        try {
            await verify2FA(code);
            setSuccess(true);
        } catch (error) {
            // Error is handled in auth context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className=" w-full flex  mx-auto px-8 py-4 bg-background rounded-lg card-shadow max-w-md">
            <div className="space-y-6">
                {success ? (
                    <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full">
                            <CheckCircle2 className="w-10 h-10 text-success" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-foreground">Access Granted!</h3>
                            <p className="text-muted-foreground mt-2">Redirecting to dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <OTPInput onComplete={handleVerify} disabled={loading} />

                        {loading && (
                            <div className="text-center space-y-2">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                <p className="text-sm text-muted-foreground">Verifying your code...</p>
                            </div>
                        )}

                        <Link
                            href="/login">
                            <Button
                                variant="link"
                                className="w-full"
                            >
                                Back to Login
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

