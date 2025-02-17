import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function SignUpForm() {
    return (
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome User</h2>

            <form className="space-y-4">
                {/* E-mailveld */}
                <Input type="email" placeholder="Enter Email" />

                {/* Wachtwoordveld */}
                <Input type="password" placeholder="●●●●●●●●" />

                {/* Leeftijd & Geslacht */}
                <div className="flex space-x-4">
                    <Input type="number" placeholder="Age" />
                    <Select>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Select>
                </div>

                {/* Lengte & Gewicht */}
                <div className="flex space-x-4">
                    <Input type="text" placeholder="Height (cm)" />
                    <Input type="text" placeholder="Weight (kg)" />
                </div>

                {/* Registreer-knop */}
                <Button className="w-full">Register</Button>
            </form>

            <p className="text-center text-gray-500 mt-4">Having Problems?</p>
        </div>
    );
}
