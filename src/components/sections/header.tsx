"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ButtonMedium } from "@/components/ui/buttonMedium";
import {Users} from "lucide-react";
import Image from "next/image";

const DEFAULT_AVATAR = "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png";

export function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
    const [menuOpen, setMenuOpen] = useState(false);
    const [friendRequests, setFriendRequests] = useState<number>(0);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            const user = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setAvatar(user.avatar?.trim() ? user.avatar : DEFAULT_AVATAR);
            fetchFriendRequests();
        }
    }, []);

    async function fetchFriendRequests() {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/friends/requests", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const requests = await res.json();
            setFriendRequests(requests.length);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setAvatar(DEFAULT_AVATAR);
        router.push("/login");
    }

    function handleGoToProfile() {
        router.push("/profile");
    }

    function linkClass(linkPath: string) {
        const isActive = pathname === linkPath;
        return `relative px-4 py-2 transition-colors duration-300 rounded-md ${
            isActive
                ? "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white font-bold"
                : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#6366F1] hover:to-[#4F46E5]"
        }`;
    }

    return (
        <header className="w-full bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <div className="text-2xl font-bold text-blue-600">
                    TapFit
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className={linkClass("/dashboard")}>
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <Link href="/" className={linkClass("/")}>
                            Home
                        </Link>
                    )}
                </nav>

                {/* Right section - Avatar + Notification + Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            {/* Notificatiebel */}
                            <div
                                className="relative cursor-pointer"
                                onClick={() => router.push("/friends")}
                            >
                                <Users className="w-6 h-6 text-gray-700" />
                                {friendRequests > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {friendRequests}
                                    </span>
                                )}
                            </div>

                            {/* Avatar */}
                            <Image
                                src={avatar}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full object-cover border border-gray-300 cursor-pointer"
                                onClick={handleGoToProfile}
                            />
                            <ButtonMedium onClick={handleLogout}>
                                Sign Out
                            </ButtonMedium>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition">
                                Sign In
                            </Link>
                            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Hamburger menu - mobile only */}
                <button
                    className="md:hidden text-3xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile menu (when open) */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t">
                    <nav className="flex flex-col space-y-2 p-4">
                        {isLoggedIn ? (
                            <>
                                <Link href="/dashboard" className={linkClass("/dashboard")} onClick={() => setMenuOpen(false)}>
                                    Dashboard
                                </Link>
                                <Link href="/how-to-use" className={linkClass("/how-to-use")} onClick={() => setMenuOpen(false)}>
                                    How to Use
                                </Link>
                                <button
                                    onClick={() => {
                                        handleGoToProfile();
                                        setMenuOpen(false);
                                    }}
                                    className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    My Profile
                                </button>
                                <ButtonMedium
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                >
                                    Sign Out
                                </ButtonMedium>
                            </>
                        ) : (
                            <>
                                <Link href="/" className={linkClass("/")} onClick={() => setMenuOpen(false)}>
                                    Home
                                </Link>
                                <Link href="/login" className={linkClass("/login")} onClick={() => setMenuOpen(false)}>
                                    Sign In
                                </Link>
                                <Link href="/register" className={linkClass("/register")} onClick={() => setMenuOpen(false)}>
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
