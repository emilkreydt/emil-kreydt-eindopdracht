"use client";

import { useState } from "react";
import { ButtonMedium } from "@/components/ui/buttonMedium";

export default function AddFriendForm() {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    async function handleAddFriend() {
        setMessage("");

        if (!email.trim()) {
            setMessage("Please enter an email.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("You need to be logged in.");
            return;
        }

        const response = await fetch("/api/friends/request-by-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Friend request sent!");
            setEmail("");
        } else {
            setMessage(data.error || "Failed to send request.");
        }
    }

    return (
        <div className="space-y-4">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter friend's email"
                className="border p-2 rounded-md w-full"
            />
            <ButtonMedium onClick={handleAddFriend}>
                Add Friend
            </ButtonMedium>
            {message && <p className={`text-sm ${message.includes("failed") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
        </div>
    );
}
