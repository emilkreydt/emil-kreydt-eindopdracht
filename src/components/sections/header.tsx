"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ButtonMedium } from "@/components/ui/buttonMedium";
import { useRouter } from "next/navigation";

export function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    //logout in de header verwerkt
    function handleLogout() {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
    }

    return (
        <h1 className="flex justify-between items-center p-6 bg-white shadow-md">
            <div className="text-2xl font-bold text-blue-600">TapFit</div>

            <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                <Link href="/how-to-use" className="text-gray-700 hover:text-blue-600">How to Use</Link>
            </nav>

            <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <ButtonMedium onClick={handleLogout}>
                        Sign Out
                    </ButtonMedium>
                ) : (
                    <>
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Sign in</Button>
                        </Link>
                        <Link href="/register">
                            <ButtonMedium variant="default" size="sm">Register</ButtonMedium>
                        </Link>
                    </>
                )}
            </div>
        </h1>
    );
}
