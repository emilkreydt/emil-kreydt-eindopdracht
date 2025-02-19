
import Image from "next/image";
import Link from "next/link";
import {Header} from "@/components/sections/header";
import {Button} from "@/components/ui/button";
import Carousel from "@/components/sections/carousel";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            {/* Hero Sectie */}
            <section className="relative flex flex-col md:flex-row items-center justify-between px-10 py-16 bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
                <div className="max-w-lg">
                    <h1 className="text-5xl font-extrabold leading-tight">
                        Transform Your Health Today
                    </h1>
                    <p className="mt-4 text-lg">
                        Track your nutrition, stay fit, and live a healthier life with ease.
                    </p>
                    <Link href="/register">
                        <Button className="mt-6">Get Started</Button>
                    </Link>
                </div>
                <Image
                    src="/hero.jpg"
                    alt="Healthy Lifestyle"
                    width={500}
                    height={500}
                    className="rounded-lg shadow-lg"
                />
            </section>

            {/* Inspirerende Quote */}
            <section className="py-12 text-center bg-white">
                <blockquote className="text-3xl italic font-semibold text-gray-800">
                    "Your health is an investment, not an expense."
                </blockquote>
            </section>

            {/* Carrousel */}
            <Carousel />

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
                <h2 className="text-4xl font-bold">Take Charge of Your Health Now!</h2>
                <p className="mt-2 text-lg">Start your journey with us today.</p>
                <Link href="/register">
                    <Button className="mt-6">Join Now</Button>
                </Link>
            </section>
        </div>
    );
}
