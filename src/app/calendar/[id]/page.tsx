"use client";

import { useParams } from "next/navigation";

export default function FriendCalendar() {
    const { id } = useParams();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl">Workout calendar for friend ID: <strong>{id}</strong></p>
        </div>
    );
}
