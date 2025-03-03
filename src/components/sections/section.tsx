import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
}

export default function Section({ children, className }: SectionProps) {
    return (
        <section
            className={`relative flex flex-col md:flex-row items-center justify-between px-10 pt-10 overflow-hidden ${className}`}
            style={{ height: 'calc(100vh - 74px)' }}  // Pas aan als je header hoger/lager is
        >
            {children}
        </section>
    );
}
