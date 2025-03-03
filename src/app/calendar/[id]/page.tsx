"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import Section from "@/components/sections/section";
import { Header } from "@/components/sections/header";

interface Workout {
    id?: string;
    date: string;
    name: string;
    completed: boolean;
}

export default function FriendCalendar() {
    const { id } = useParams();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [friendName, setFriendName] = useState<string>("Friend");

    useEffect(() => {
        fetchWorkouts();
        fetchFriendInfo();
    }, [id]);

    async function fetchWorkouts() {
        const res = await fetch(`/api/workouts/${id}`);
        if (res.ok) {
            const data = await res.json();
            setWorkouts(data);
        } else {
            console.error("Failed to fetch workouts");
        }
    }

    async function fetchFriendInfo() {
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
            const data = await res.json();
            setFriendName(`${data.firstName} ${data.lastName}`);
        }
    }

    const today = new Date();
    const firstDay = startOfMonth(today);
    const lastDay = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <Section className="flex justify-center items-center min-h-[calc(100vh-64px)] w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5]">
                <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
                    <h1 className="text-2xl font-extrabold text-center mb-4">
                        {friendName}'s Workout Calendar - {format(today, "MMMM yyyy")}
                    </h1>

                    <div className="grid grid-cols-7 gap-2 w-full">
                        {daysInMonth.map((day) => {
                            const dateString = format(day, "yyyy-MM-dd");
                            const workout = workouts.find((w) => w.date === dateString);

                            return (
                                <div
                                    key={dateString}
                                    className={`p-3 rounded-md text-center border transition ${
                                        workout ? "bg-green-500 text-white" : "bg-gray-100"
                                    } ${isToday(day) ? "border-blue-500 font-bold" : ""}`}
                                >
                                    {format(day, "d")}
                                    {workout && <p className="text-xs mt-1">{workout.name}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Section>
        </div>
    );
}
