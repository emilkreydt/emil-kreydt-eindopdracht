"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/sections/header";
import Section from "@/components/sections/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/ui/backButton";

type UserProfile = {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    age: number;
    weight: number;
    height: number;
    gender: string;
};

export default function FriendProfile() {
    const { id } = useParams();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/users/${id}`);
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                console.error("Failed to fetch user profile");
            }
            setLoading(false);
        }
        fetchUser();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-10">Loading profile...</p>;
    }

    if (!user) {
        return <p className="text-center mt-10 text-red-600">User not found.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <Section className="flex justify-center items-center min-h-[calc(100vh-64px)] w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5]">
                <BackButton/>
                <Card className="w-full max-w-2xl bg-white shadow-lg rounded-lg">
                    <CardHeader className="flex items-center space-x-4">
                        <img
                            src={user.avatar || "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png"}
                            alt="Profile Picture"
                            className="w-20 h-20 rounded-full object-cover border border-gray-300"
                        />
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                {user.firstName} {user.lastName}
                            </CardTitle>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <ProfileField label="Age" value={`${user.age} years`} />
                            <ProfileField label="Weight" value={`${user.weight} kg`} />
                            <ProfileField label="Height" value={`${user.height} cm`} />
                            <ProfileField label="Gender" value={user.gender.toUpperCase()} />
                        </div>
                    </CardContent>
                </Card>
            </Section>
        </div>
    );
}

function ProfileField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <span className="text-lg font-semibold text-gray-800">{value}</span>
        </div>
    );
}
