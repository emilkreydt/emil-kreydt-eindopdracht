"use client";

import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
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


    return (
        <Section className="min-h-screen flex flex-col bg-gradient-to-r from-[#6366F1] to-[#4F46E5] p-6">
            <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Workout Calendar - {format(new Date(), "MMMM yyyy")}
                </h2>

                <div className="flex flex-col items-center space-y-4">
                    <p className="text-lg text-gray-700">Today's Workout</p>

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
