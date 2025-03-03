"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}  // ga naar de vorige pagina
            className="absolute top-4 left-4 bg-white border border-black px-4 py-2 rounded-md text-black hover:bg-gray-100 transition"
        >
            Go Back
        </button>
    );
}
