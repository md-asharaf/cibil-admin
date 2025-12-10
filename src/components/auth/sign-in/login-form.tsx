'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Eye, EyeOff } from "lucide-react";
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
import Image from "next/image";

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
    const [showPassword, setShowPassword] = useState(false);
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
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (data: LoginOTPFormValues) => {
        setLoading(true);

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
        <div className="flex items-center justify-center">
            <div className="w-full max-w-7xl bg-background/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row justify-between">
                <div className="w-full lg:w-2/5 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                    <div className="">
                        <div className="inline-block border border-muted rounded-full px-6 py-2 mb-8 bg-transparent">
                            <span className="font-medium">Cibil</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-center">
                            Welcome Back
                        </h1>
                        <p className="text-center">Sign in to your account</p>
                    </div>

                    <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as "password" | "otp")}>
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-amber-300 rounded-full">
                            <TabsTrigger value="password" className="rounded-full">Password</TabsTrigger>
                            <TabsTrigger value="otp" className="rounded-full">OTP</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password">
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(handlePasswordLogin)} className="space-y-6">
                                    <FormField
                                        control={passwordForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm pl-6 text-muted">Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        {...field}
                                                        className="w-full px-6 py-4 bg-background rounded-full border-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition h-auto"
                                                    />
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
                                                <FormLabel className="text-sm pl-6 text-muted">Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••••••••••••••"
                                                            {...field}
                                                            className="w-full px-6 py-4 bg-background rounded-full border-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition pr-12 h-auto"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-gray-600 hover:bg-transparent"
                                                        >
                                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 rounded-full transition shadow-lg hover:shadow-xl h-auto"
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
                                                        <FormLabel className="text-sm pl-6 text-muted">Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="you@example.com"
                                                                {...field}
                                                                className="w-full px-6 py-4 bg-background rounded-full border-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition h-auto"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 rounded-full transition shadow-lg hover:shadow-xl h-auto"
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
                                            className="w-full rounded-full"
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

                    <div className="mt-8 flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/sign-up" className="text-gray-900 font-semibold hover:underline">
                                Sign up
                            </Link>
                        </div>
                        <Link href="/terms" className="text-gray-600 hover:text-gray-900 hover:underline">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>

                {/* Right Side - Image Section */}
                <div className="w-full lg:w-2/3 bg-linear-to-br p-8 relative overflow-hidden hidden lg:block">
                    <div className="relative h-full rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-black/20 via-transparent to-black/10 pointer-events-none z-1" />
                        <Image
                            src="https://cdn.pixabay.com/photo/2021/07/10/11/53/credit-card-6401275_1280.png"
                            alt="Team Collaboration"
                            width={600}
                            height={400}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

