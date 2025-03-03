"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { ButtonMedium } from "@/components/ui/buttonMedium";

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
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/workouts", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            setWorkouts(await res.json());
        } else {
            console.error("Failed to fetch workouts");
        }
    }

    async function addWorkout() {
        if (!workoutName.trim()) return;

        const token = localStorage.getItem("token");
        await fetch("/api/workouts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ date: todayString, name: workoutName, completed: true }),
        });

        setWorkoutName("");
        fetchWorkouts();
    }

    async function removeWorkout() {
        const token = localStorage.getItem("token");
        await fetch("/api/workouts", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ date: todayString }),
        });

        fetchWorkouts();
    }

    const today = new Date();
    const days = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });
    const todayWorkout = workouts.find((w) => w.date === todayString);

    return (
        <div className="space-y-6">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                    const dateString = format(day, "yyyy-MM-dd");
                    const workout = workouts.find((w) => w.date === dateString);

                    return (
                        <div key={dateString}
                             className={`p-3 rounded-md text-center border cursor-pointer transition ${
                                 workout ? "bg-[#6366F1] text-white" : "bg-gray-100"
                             } ${isToday(day) ? "border-blue-500 font-bold" : ""}`}
                        >
                            {format(day, "d")}
                            {workout && <p className="text-xs mt-1">{workout.name}</p>}
                        </div>
                    );
                })}
            </div>

            {/* Today's Workout Input */}
            {todayWorkout ? (
                <ButtonMedium onClick={removeWorkout} className="bg-red-400 hover:bg-red-600">
                    Remove Today's Workout
                </ButtonMedium>
            ) : (
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Workout name"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                    <ButtonMedium onClick={addWorkout}>
                        Add Workout
                    </ButtonMedium>
                </div>
            )}
        </div>
    );
}
