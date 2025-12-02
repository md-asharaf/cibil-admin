'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OTPInput } from "../input-otp";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

const loginPasswordSchema = z.object({
    email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be less than 128 characters"),
});

const loginOTPSchema = z.object({
    email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
});

type LoginPasswordFormValues = z.infer<typeof loginPasswordSchema>;
type LoginOTPFormValues = z.infer<typeof loginOTPSchema>;

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
    const [otpSent, setOtpSent] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const router = useRouter();
    const { login, loginWithOTP } = useAuth();
    const passwordForm = useForm<LoginPasswordFormValues>({
        resolver: zodResolver(loginPasswordSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const otpForm = useForm<LoginOTPFormValues>({
        resolver: zodResolver(loginOTPSchema),
        defaultValues: {
            email: "",
        },
    });

    const handlePasswordLogin = async (data: LoginPasswordFormValues) => {
        setLoading(true);
        try {
            await login(data.email, data.password);
        } catch (error) {
            // Error is handled in auth context
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (data: LoginOTPFormValues) => {
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        setOtpSent(true);
        setShowOTPInput(true);

        toast.success("OTP Sent", {
            description: `A verification code has been sent to ${data.email}`,
        });
    };

    const handleOTPLogin = async (otp: string) => {
        setLoading(true);
        try {
            const email = otpForm.getValues("email");
            await loginWithOTP(email, otp);
        } catch (error) {
            // Error is handled in auth context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="max-w-md w-full mx-auto p-8 bg-background rounded-lg card-shadow">
            <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as "password" | "otp")}>
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-amber-300">
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="otp">OTP</TabsTrigger>
                </TabsList>

                <TabsContent value="password">
                    <Form {...passwordForm} >
                        <form onSubmit={passwordForm.handleSubmit(handlePasswordLogin)} className="space-y-6">
                            <FormField
                                control={passwordForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full  hover:opacity-90 transition-opacity"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="otp">
                    <div className="space-y-6">
                        {!showOTPInput ? (
                            <Form {...otpForm}>
                                <form onSubmit={otpForm.handleSubmit(handleSendOTP)} className="space-y-6">
                                    <FormField
                                        control={otpForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                        <Input
                                                            type="email"
                                                            placeholder="you@example.com"
                                                            className="pl-10"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Sending OTP...
                                            </>
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <p className="text-sm text-center text-muted-foreground">
                                        Enter the code sent to {otpForm.getValues("email")}
                                    </p>
                                    <OTPInput onComplete={handleOTPLogin} disabled={loading} />
                                </div>

                                {loading && (
                                    <div className="text-center space-y-2">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        <p className="text-sm text-muted-foreground">Verifying code...</p>
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setShowOTPInput(false);
                                        setOtpSent(false);
                                    }}
                                >
                                    Use Different Email
                                </Button>
                            </>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up">
                    <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto font-semibold text-primary"
                    >
                        Sign up
                    </Button>
                </Link>
            </div>
        </div>
    );
};

