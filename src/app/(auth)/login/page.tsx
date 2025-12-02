import SignIn from "@/components/auth/sign-in/login-form";

export default function SignInPage() {
    return (

        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold ">Welcome Back</h1>
                <p className=" mt-2">Sign in to your account</p>
            </div>
            <SignIn />
        </div>
    )
}