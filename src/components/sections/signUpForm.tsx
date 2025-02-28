"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {ButtonMedium} from "@/components/ui/buttonMedium";
import {format} from "date-fns";

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
        avatar: "",
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, avatar: file }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // Upload de afbeelding eerst naar Cloudinary
            const imageUrl = await uploadImage(formData.avatar);

            // Stuur daarna alle data (inclusief de Cloudinary URL) naar je signup API
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
        } catch (error) {
            setMessage("Something went wrong during registration.");
        }
    }

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Image upload failed");
        }

        const data = await response.json();
        return data.secure_url;  // Dit is de URL die je opslaat in je database
    }


    return (
        <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-[-10px]">
            <h1 className="text-2xl font-extrabold leading-tight text-center mb-5">
                Sign Up
            </h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>

                {/* mail */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* ww */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="●●●●●●●●"
                        value={formData.password}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* voornaam */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">First name</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* achternaam */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Last name</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* leeftijs */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Age</label>
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* kgg */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Weight</label>
                    <input
                        type="number"
                        name="weight"
                        placeholder="Weight (kg)"
                        value={formData.weight}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* lengte */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Size</label>
                    <input
                        type="number"
                        name="height"
                        placeholder="Size (cm)"
                        value={formData.height}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* gender */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">I prefer not to tell this</option>
                    </select>
                </div>

                {/* avatar */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium">Avatar (Profile Picture)</label>
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>


                {/* submit */}
                <div className="col-span-1 md:col-span-2 flex justify-center">
                    <ButtonMedium type="submit">
                        Register
                    </ButtonMedium>
                </div>
            </form>

            {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        </div>
    );
}
