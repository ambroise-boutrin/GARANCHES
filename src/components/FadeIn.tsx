"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { estNavigationDouce } from "@/lib/navigationDouce";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
}

export default function FadeIn({
    children,
    delay = 0,
    className = "",
    direction = "up"
}: FadeInProps) {

    const getInitial = () => {
        switch (direction) {
            case "up": return { opacity: 0, y: 40 };
            case "down": return { opacity: 0, y: -40 };
            case "left": return { opacity: 0, x: 40 };
            case "right": return { opacity: 0, x: -40 };
            default: return { opacity: 0, y: 40 };
        }
    };

    const getTarget = () => {
        switch (direction) {
            case "up":
            case "down": return { opacity: 1, y: 0 };
            case "left":
            case "right": return { opacity: 1, x: 0 };
            default: return { opacity: 1, y: 0 };
        }
    };

    return (
        <motion.div
            // Pas d'apparition en fondu après un clic dans la barre d'un univers (effet de rechargement).
            initial={estNavigationDouce() ? false : getInitial()}
            whileInView={getTarget()}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
