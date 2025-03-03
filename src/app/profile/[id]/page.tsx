"use client";

import { useParams } from "next/navigation";

export default function FriendProfile() {
    const { id } = useParams();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl">Profile page for friend ID: <strong>{id}</strong></p>
        </div>
    );
}
