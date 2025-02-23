"use client"; // 🔥 Voeg dit toe als eerste regel!

import { useState } from "react";

export function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        setMessage(data.message || data.error);
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sign Up</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full"
                />
                <input
                    type="password"
                    placeholder="●●●●●●●●"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 w-full">
                    Register
                </button>
            </form>
            {message && <p className="mt-2 text-center text-red-600">{message}</p>}
        </div>
    );
}



