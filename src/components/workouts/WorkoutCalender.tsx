"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { ButtonMedium } from "@/components/ui/buttonMedium";
import Section from "@/components/sections/section";

interface Workout {
    id?: string;
    date: string;
    name: string;
    completed: boolean;
}

export default function WorkoutCalendar() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [workoutName, setWorkoutName] = useState<string>("");
    const todayString = format(new Date(), "yyyy-MM-dd");

    useEffect(() => {
        fetchWorkouts();
    }, []);

    async function fetchWorkouts() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, user is not authenticated");
                return;
            }

            const res = await fetch("/api/workouts", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                console.error(`API request failed: ${res.status} ${res.statusText}`);
                return;
            }

            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("Unexpected API response:", data);
                setWorkouts([]);
                return;
            }

            setWorkouts(data);
        } catch (error) {
            console.error("Error fetching workouts:", error);
        }
    }

    async function toggleWorkout() {
        if (!workoutName.trim()) {
            console.error("Workout name is required.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Error: No token found");
                return;
            }

            const existingWorkout = workouts.some((w) => w.date === todayString);
            const method = existingWorkout ? "DELETE" : "POST";

            await fetch("/api/workouts", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ date: todayString, name: workoutName, completed: !existingWorkout }),
            });

            setWorkoutName("");
            fetchWorkouts();
        } catch (error) {
            console.error("Error updating workout:", error);
        }
    }

    const today = new Date();
    const firstDay = startOfMonth(today);
    const lastDay = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });

    return (
        <Section className="relative w-screen h-screen bg-gradient-to-r from-[#6366F1] to-[#4F46E5] flex items-center justify-center">
            <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-[-20px]">
                <h1 className="font-extrabold leading-tight text-center">
                    Workout Calendar - {format(today, "MMMM yyyy")}
                </h1>

                <div className="grid grid-cols-7 gap-2 w-full">
                    {daysInMonth.map((day) => {
                        const dateString = format(day, "yyyy-MM-dd");
                        const workout = workouts.find((w) => w.date === dateString);

                        return (
                            <div
                                key={dateString}
                                className={`p-3 rounded-md text-center cursor-pointer border transition ${
                                    workout ? "bg-green-500 text-white" : "bg-gray-100"
                                } ${isToday(day) ? "border-blue-500 font-bold" : ""}`}
                            >
                                {format(day, "d")}
                                {workout && <p className="text-xs mt-1">{workout.name}</p>}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-col items-center space-y-4 w-full">
                    <h1 className="font-extrabold leading-tight text-center">
                        Today's workout
                    </h1>
                    {workouts.some((w) => w.date === todayString) ? (
                        <p className="text-green-600 font-bold">Workout already logged for today</p>
                    ) : (
                        <input
                            type="text"
                            placeholder="Workout name"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                        />
                    )}

                    <ButtonMedium onClick={toggleWorkout} disabled={workouts.some((w) => w.date === todayString)}>
                        {workouts.some((w) => w.date === todayString) ? "Workout Added" : "Add Workout"}
                    </ButtonMedium>
                </div>
            </div>
        </Section>
    );

}
