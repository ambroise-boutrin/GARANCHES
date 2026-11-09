import { ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
}

// Ancien bloc « apparition au scroll ». Le contenu s'affiche désormais directement,
// sans glissement ni fondu : plus sobre, surtout sur téléphone.
export default function FadeIn({ children, className = "" }: FadeInProps) {
    return <div className={className}>{children}</div>;
}
