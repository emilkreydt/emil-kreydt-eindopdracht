import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/sections/header";
import Image from "next/image";
import Section from "@/components/sections/section";

export default function Home() {
    return (
        <div>
            <Header />

            <Section className="min-h-screen flex flex-col bg-gradient-to-r from-[#6366F1] to-[#4F46E5] ">
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
                    src="/images/homepage.png"
                    alt="Fitness Icon"
                    width={300}
                    height={200}
                    className="rounded-lg bg-transparent"
                />
            </Section>
        </div>
    );
}
