"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonMedium } from "@/components/ui/buttonMedium";
import { useRouter } from "next/navigation";

const DEFAULT_AVATAR = "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png";

export function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            const user = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setAvatar(user.avatar?.trim() ? user.avatar : DEFAULT_AVATAR);
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setAvatar(DEFAULT_AVATAR);
        router.push("/login");
    }

    return (
        <header className="flex justify-between items-center p-6 bg-white shadow-md">
            <div className="text-2xl font-bold text-blue-600">TapFit</div>

            <nav className="hidden md:flex space-x-6">
                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/how-to-use">How to Use</Link>
                    </>
                ) : (
                    <Link href="/">Home</Link>
                )}
            </nav>

            <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <>
                        <img
                            src={avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                        <ButtonMedium onClick={handleLogout}>Sign Out</ButtonMedium>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <ButtonMedium variant="ghost" size="sm">Sign in</ButtonMedium>
                        </Link>
                        <Link href="/register">
                            <ButtonMedium variant="default" size="sm">Register</ButtonMedium>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
