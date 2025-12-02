import Setup2FA from "@/components/auth/2fa/set-up-2fa";

export default function Setup2FAPage() {
    return (

        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold ">Enable Two-Factor Authentication</h1>
                <p className=" mt-2">Secure your account with an additional layer of protection</p>
            </div>
            <Setup2FA />
        </div>
    )
}