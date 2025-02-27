"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { ButtonMedium } from "@/components/ui/buttonMedium";

interface Workout {
    id?: string;
    date: string;
    completed: boolean;
}

export default function WorkoutCalendar() {
    const [workouts, setWorkouts] = useState<Workout[]>([]); // ✅ Ensure workouts is an array
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    async function fetchWorkouts() {
        try {
            const token = localStorage.getItem("token");
            console.log("Token being used:", token); // Check if token exists

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
            console.log("API Response:", data);

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

    async function toggleWorkout(date: string) {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Error: No token found");
                return;
            }

            const existingWorkout = workouts?.some((w) => w.date === date);
            const method = existingWorkout ? "DELETE" : "POST";

            await fetch("/api/workouts", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ date, completed: !existingWorkout }),
            });

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
        <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                Workout Calendar - {format(today, "MMMM yyyy")}
            </h2>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day) => {
                    const dateString = format(day, "yyyy-MM-dd");
                    const hasWorkout = Array.isArray(workouts) && workouts.some((w) => w.date === dateString && w.completed);

                    return (
                        <div
                            key={dateString}
                            className={`p-3 rounded-md text-center cursor-pointer border transition ${
                                hasWorkout ? "bg-green-500 text-white" : "bg-gray-100"
                            } ${isToday(day) ? "border-blue-500 font-bold" : ""}`}
                            onClick={() => setSelectedDate(dateString)}
                        >
                            {format(day, "d")}
                        </div>
                    );
                })}
            </div>

            {/* Workout Actions */}
            {selectedDate && (
                <div className="mt-4 p-4 bg-gray-200 rounded-md">
                    <p className="text-lg">Workout for {selectedDate}</p>
                    <ButtonMedium onClick={() => toggleWorkout(selectedDate)}>
                        {workouts?.some((w) => w.date === selectedDate && w.completed)
                            ? "Remove Workout"
                            : "Add Workout"}
                    </ButtonMedium>
                </div>
            )}
        </div>
    );
}
