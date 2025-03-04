"use client";

import React, { useEffect, useState } from "react";
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
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    useEffect(() => {
        async function fetchStats() {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`/api/workouts/monthly?month=${currentMonth}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else {
                console.error("Failed to fetch stats");
            }
        }

        fetchStats();
    }, []);

    const cumulativeAverage: number[] = [];
    let totalWorkouts = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${currentMonth}-${day.toString().padStart(2, "0")}`;
        const workoutCount = stats.find(d => d.date === date)?.workoutCount || 0;

        totalWorkouts += workoutCount;
        const average = totalWorkouts / day;

        cumulativeAverage.push(average);
    }

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
            },
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
