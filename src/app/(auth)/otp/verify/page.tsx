import VerifyOTP from "@/components/auth/2fa/verify-otp";

export default function VerifyOTPPage() {
    return (

        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold ">Verify Your Account</h1>
                <p className=" mt-2">Enter the 6-digit code sent to your email or phone</p>
            </div>
            <VerifyOTP />
        </div>
    )
}