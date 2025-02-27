import { Header } from "@/components/sections/header";
import WorkoutCalendar from "@/components/workouts/WorkoutCalender";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <WorkoutCalendar />
        </div>
    );
}
