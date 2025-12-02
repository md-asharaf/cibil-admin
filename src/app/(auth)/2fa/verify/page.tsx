import Verify2FA from "@/components/auth/2fa/verify-2fa";

export default function Verify2FAPage() {
    return (

        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold ">Two-Factor Authentication</h1>
                <p className=" mt-2">Enter the 6-digit code from your authenticator app</p>
            </div>
            <Verify2FA />
        </div>
    )
}