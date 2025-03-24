"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonMedium } from "@/components/ui/buttonMedium";

const DEFAULT_AVATAR = "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png";

export function SignUpForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        age: "",
        weight: "",
        height: "",
        gender: "male",
        avatar: null as File | null,  // dit moet als bestand, niet als string
    });

    const [message, setMessage] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, avatar: file }));
    }

    function validatePassword(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        return passwordRegex.test(password);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validatePassword(formData.password)) {
            setMessage("Password must be at least 10 characters, with 1 uppercase, 1 lowercase, 1 number and 1 special character.");
            return;
        }

        let imageUrl = DEFAULT_AVATAR;

        if (formData.avatar) {
            try {
                imageUrl = await uploadImage(formData.avatar);
            } catch (error) {
                if (error instanceof Error) {
                    setMessage(error.message);
                } else {
                    setMessage("An unknown error occurred");
                }
            }
        }

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, avatar: imageUrl }),
        });

        const data = await response.json();
        if (data.error) {
            setMessage(data.error);
        } else {
            router.push("/login");
        }
    }

    async function uploadImage(file: File): Promise<string> {
        const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
        const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryUploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Image upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-xl mx-auto">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                {/* mail */}
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* ww */}
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Bijv: Antwerpen123@"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* voornaam */}
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium">First name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* achternaal */}
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium">Last name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* leeftijd */}
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* kg */}
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium">Weight (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* lengte */}
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium">Height (cm)</label>
                    <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        required
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* gender */}
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* avatar */}
                <div className="flex flex-col md:col-span-2">
                    <label className="text-gray-700 text-sm font-medium">Avatar (Profile Picture)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border p-1.5 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* opslaan */}
                <div className="col-span-2 flex justify-center">
                    <ButtonMedium className="px-6 py-2 text-sm" type="submit">Register</ButtonMedium>
                </div>
            </form>

            {message && <p className="mt-3 text-center text-red-600 text-sm">{message}</p>}
        </div>
    );
}
