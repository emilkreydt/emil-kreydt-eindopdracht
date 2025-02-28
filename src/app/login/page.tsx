"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/sections/header";
import Section from "@/components/sections/section";
import Link from "next/link";
import { ButtonMedium } from "@/components/ui/buttonMedium";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error);
                return;
            }

            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />

            <Section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-[#6366F1] to-[#4F46E5] p-6">
                <div className="w-full md:w-1/2 text-center md:text-left text-white p-6">
                    <h1 className="text-4xl font-bold">Log in to access your dashboard</h1>
                    <p className="mt-2 text-lg">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-red-300 underline">
                            Sign up here!
                        </Link>
                    </p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h1 className="text-2xl font-extrabold leading-tight text-center mb-5">
                            Log In
                        </h1>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="●●●●●●●●"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <ButtonMedium type="submit">
                                Login
                            </ButtonMedium>
                        </form>

                        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
                    </div>
                </div>
            </Section>
        </div>
    );
}
