import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <h1 className="flex justify-between items-center p-6 bg-white shadow-md">
            {/* Logo */}
            <div className="text-2xl font-bold text-blue-600">HealthyMe</div>

            {/* Navigatie */}
            <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600">About Us</Link>
                <Link href="/how-to-use" className="text-gray-700 hover:text-blue-600">How to Use</Link>
            </nav>

            {/* Knoppen */}
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">Sign in</Button>

                {/* 🔹 Register knop met Next.js navigatie */}
                <Link href="/register">
                    <Button variant="default" size="sm">Register</Button>
                </Link>
            </div>
        </h1>
    );
}
