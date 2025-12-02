import SignUp from "@/components/auth/sign-up/sign-up-form";

export default function SignUpPage() {
    return (

        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold ">Create Account</h1>
                <p className=" mt-2">Sign up for a new account</p>
            </div>
            <SignUp />
        </div>
    )
}