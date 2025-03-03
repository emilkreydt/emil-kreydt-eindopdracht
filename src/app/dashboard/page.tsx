import { Header } from "@/components/sections/header";
import WorkoutCalendar from "@/components/workouts/WorkoutCalender";
import AddFriendForm from "@/components/friends/addFriendForm";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <WorkoutCalendar />
            <AddFriendForm />
        </div>
    );
}
