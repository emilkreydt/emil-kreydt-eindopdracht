"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const testimonials = [
    { name: "Emma J.", text: "This app changed my life! I feel healthier than ever." },
    { name: "Liam B.", text: "Tracking my nutrition has never been easier." },
    { name: "Sophia W.", text: "The insights are amazing! Highly recommend." }
];

export default function Carousel() {
    const [index, setIndex] = useState(0);

    return (
        <section className="py-12 text-center bg-gray-200">
            <h2 className="text-3xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl italic">"{testimonials[index].text}"</p>
            <p className="mt-2 font-semibold">{testimonials[index].name}</p>
            <div className="mt-6 space-x-4">
                <Button variant="outline" onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)}>←</Button>
                <Button variant="outline" onClick={() => setIndex((index + 1) % testimonials.length)}>→</Button>
            </div>
        </section>
    );
}
