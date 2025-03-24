"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Stat {
    date: string;
    workoutCount: number;
}

export default function WorkoutAverageChart() {
    const [stats, setStats] = useState<Stat[]>([]);
    const currentMonth = format(new Date(), "yyyy-MM");

    const daysInMonth = useMemo(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }, []);

    useEffect(() => {
        async function fetchStats() {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`/api/workouts/monthly?month=${currentMonth}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    console.error("Failed to fetch stats");
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        }

        fetchStats();
    }, [currentMonth]);

    const cumulativeAverage = useMemo(() => {
        let totalWorkouts = 0;
        const result: number[] = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${currentMonth}-${day.toString().padStart(2, "0")}`;
            const workoutCount = stats.find(d => d.date === date)?.workoutCount || 0;

            totalWorkouts += workoutCount;
            result.push(totalWorkouts / day);
        }

        return result;
    }, [stats, currentMonth, daysInMonth]);

    const chartData = {
        labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
        datasets: [
            {
                label: "Average Workouts per Day",
                data: cumulativeAverage,
                borderColor: "#6366F1",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                tension: 0.3
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 1
            }
        }
    };

    return (
        <div className="w-full">
            <Line data={chartData} options={options} />
        </div>
    );
}
