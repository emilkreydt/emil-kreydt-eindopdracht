import { SignUpForm } from "@/components/sections/signUpForm";
import {Header} from "@/components/sections/header";
import Section from "@/components/sections/section";

export default function SignUp() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <Header />

            <Section className="bg-gray-100 min-h-screen">
            {/* Hoofdcontent */}
                    {/* Linkerkant: Welkomsttekst + Afbeelding */}
                    <div className="w-full md:w-1/2 text-center md:text-left p-6">
                        <h1 className="text-4xl font-bold text-gray-800">
                            Sign Up to get your nutrients
                        </h1>
                        <p className="text-gray-600 mt-2">
                            If you already have an account, you can{" "}
                            <a href="#" className="text-blue-600 underline">Login here!</a>
                        </p>
                    </div>

                    {/* Rechterkant: Registratieformulier */}
                    <div className="w-full md:w-1/3 p-6">
                        <SignUpForm />
                    </div>
            </Section>
        </div>
    );
}
