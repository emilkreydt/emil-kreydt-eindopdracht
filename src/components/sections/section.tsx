import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
}

export default function Section({ children, className }: SectionProps) {
    return (
        <section
            className={`relative flex flex-col md:flex-row items-center justify-between px-10 pt-10 min-h-screen h-screen overflow-hidden ${className}`}
        >
            {children}
        </section>
    );
}
