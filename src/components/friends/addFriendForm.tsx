"use client";

import { useState } from "react";
import { ButtonMedium } from "@/components/ui/buttonMedium";

export default function AddFriendForm() {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    async function handleAddFriend() {
        setMessage(""); // reset message

        if (!email.trim()) {
            setMessage("Please enter an email.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("You need to be logged in to add a friend.");
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
                setEmail(""); // clear input
            } else {
                setMessage(data.error || "Failed to send request.");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-bold">Add Friend</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter friend's email"
                className="w-full p-2 border rounded-md"
            />
            <ButtonMedium onClick={handleAddFriend}>
                Add Friend
            </ButtonMedium>
            {message && <p className={`text-sm ${message.includes("failed") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
        </div>
    );
}
