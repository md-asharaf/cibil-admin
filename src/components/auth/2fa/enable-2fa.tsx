'use client";'
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Enable2FAPrompt = () => {
    const router = useRouter();

    const handleLater = () => {
        sessionStorage.setItem("isAuthenticated", "true");
        router.push("/");
    };

    return (
        <div
            className="max-w-lg w-full mx-auto p-8 bg-accent/10 rounded-lg shadow-lg">
            <div className="space-y-6">
                <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4">
                        <Shield className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        Protect Your Account with 2FA
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your authenticator app.
                    </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-primary">1</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground text-sm">Enhanced Security</h4>
                            <p className="text-xs text-muted-foreground">Protect against unauthorized access</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-primary">2</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground text-sm">Quick Setup</h4>
                            <p className="text-xs text-muted-foreground">Takes less than 2 minutes to configure</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-primary">3</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground text-sm">Peace of Mind</h4>
                            <p className="text-xs text-muted-foreground">Know your account is always secure</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Link
                        href="/setup-2fa"
                    >
                        <Button
                            className="w-full  hover:opacity-90 transition-opacity"
                            size="lg"
                        >
                            Enable 2FA Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>

                    <Button
                        onClick={handleLater}
                        variant="ghost"
                        className="w-full"
                    >
                        Enable Later
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        You can enable 2FA anytime from account settings
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Enable2FAPrompt;
