import { SignUpForm } from "@/components/sections/signUpForm";
import { Header } from "@/components/sections/header";
import Section from "@/components/sections/section";
import Link from "next/link";

export default function SignUp() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />

            <Section className="flex flex-col bg-gradient-to-r from-[#6366F1] to-[#4F46E5]">
                {/* links */}
                <div className="w-full md:w-1/2 text-center md:text-left text-white p-6">
                    <h1 className="text-4xl font-bold">Sign Up to get your nutrients</h1>
                    <p className="mt-2 text-lg">
                        If you already have an account, you can{" "}
                        <Link href="/login" className="text-red-300 underline">
                            Login here!
                        </Link>
                    </p>
                </div>
                {/* rechts */}
                <SignUpForm />
            </Section>
        </div>
    );
}
