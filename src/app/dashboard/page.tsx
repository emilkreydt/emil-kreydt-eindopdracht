import { Header } from "@/components/sections/header";
import WorkoutCalendar from "@/components/workouts/WorkoutCalender";
import AddFriendForm from "@/components/friends/addFriendForm";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-[#6366F1] to-[#4F46E5]">
            <Header />

            <div className="container mx-auto py-12 space-y-8 px-4">

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Calendar (2/3 van de breedte op desktop) */}
                    <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Workout Calendar</h2>
                        <WorkoutCalendar/>
                    </div>

                    {/* Add Friend (neemt 1 kolom, maar past zich in hoogte aan de content aan) */}
                    <div className="flex items-start justify-center">
                        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a Friend</h2>
                            <AddFriendForm/>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
