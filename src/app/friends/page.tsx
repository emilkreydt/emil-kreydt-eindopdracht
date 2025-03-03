"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonMedium } from "@/components/ui/buttonMedium";
import Section from "@/components/sections/section";
import Link from "next/link";

type FriendRequest = {
    requesterId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
};

type Friend = {
    friendId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
};

export default function FriendsPage() {
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchRequests();
        fetchFriends();
    }, []);

    async function fetchRequests() {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/friends/requests", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const data = await res.json();
            console.log("Fetched requests:", data);  // 👀 Check dat dit klopt
            setRequests(data);
        }
    }

    async function fetchFriends() {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/friends/list", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const data = await res.json();
            setFriends(data);
        }
    }

    async function handleAccept(requesterId: string) {
        const token = localStorage.getItem("token");
        await fetch("/api/friends/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ requesterId }),
        });

        fetchRequests();
        fetchFriends();
    }

    async function handleReject(requesterId: string) {
        const token = localStorage.getItem("token");
        await fetch("/api/friends/reject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ requesterId }),
        });

        fetchRequests();
    }

    return (
        <Section className="min-h-screen bg-gradient-to-r from-[#6366F1] to-[#4F46E5] flex flex-col items-center p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl space-y-6">
                <h1 className="text-2xl font-extrabold text-center">Friend Requests</h1>

                {/* Openstaande Friend Requests */}
                {requests.length === 0 ? (
                    <p className="text-gray-500 text-center">No pending friend requests.</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req.requesterId} className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
                                <div className="flex items-center space-x-4">
                                    <img src={req.avatar} alt={req.firstName} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-medium">{req.firstName} {req.lastName}</p>
                                        <p className="text-sm text-gray-500">{req.email}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <ButtonMedium onClick={() => handleAccept(req.requesterId)}>Accept</ButtonMedium>
                                    <ButtonMedium
                                        onClick={() => handleReject(req.requesterId)}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Reject
                                    </ButtonMedium>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <h1 className="text-2xl font-extrabold text-center mt-6">My Friends</h1>

                {/* Vriendenlijst */}
                {friends.length === 0 ? (
                    <p className="text-gray-500 text-center">No friends yet.</p>
                ) : (
                    <div className="space-y-4">
                        {friends.map((friend) => (
                            <Link
                                key={friend.friendId}
                                href={`/profile/${friend.friendId}`}
                                className="flex items-center space-x-4 p-4 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition"
                            >
                                <img src={friend.avatar} alt={friend.firstName} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-medium">{friend.firstName} {friend.lastName}</p>
                                    <p className="text-sm text-gray-500">{friend.email}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}
