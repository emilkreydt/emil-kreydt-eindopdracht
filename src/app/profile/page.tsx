"use client";

import { useEffect, useState } from "react";
import Section from "@/components/sections/section";
import { Header } from "@/components/sections/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type User = {
    email: string;
    firstName: string;
    lastName: string;
    age?: number;
    weight?: number;
    height?: number;
    gender?: string;
    avatar?: string;
};

function safeValue(value: string | number | undefined, unit?: string) {
    if (value === undefined || value === null) return "N/A";
    return unit ? `${value} ${unit}` : `${value}`;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return <p className="text-center mt-10">Loading profile...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <Section className="flex justify-center items-center min-h-[calc(100vh-64px)] w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5]">
                <Card className="w-full text-center bg-white rounded-lg">
                    <CardHeader className="flex items-center space-x-4 p-6">
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

                    <CardContent className="p-6 pt-0 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <ProfileField label="Age" value={safeValue(user.age, "years")} />
                            <ProfileField label="Weight" value={safeValue(user.weight, "kg")} />
                            <ProfileField label="Height" value={safeValue(user.height, "cm")} />
                            <ProfileField label="Gender" value={safeValue(user.gender?.toUpperCase())} />
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
