"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { format } from "date-fns";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface MonthlyStat {
    date: string;
    count: number;
}

export default function WorkoutChart() {
    const [stats, setStats] = useState<MonthlyStat[]>([]);
    const currentMonth = format(new Date(), "yyyy-MM");

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
            }
        }

        fetchStats();
    }, []);

    const chartData = {
        labels: stats.map(s => format(new Date(s.date), "d MMM")),
        datasets: [
            {
                label: "Workouts",
                data: stats.map(s => s.count),
                backgroundColor: "#6366F1"
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Workouts per Day" }
        }
    };

    return (
        <div className="w-full">
            <Bar data={chartData} options={options}/>
        </div>
    );
}
