"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
    src: string;
    alt: string;
    className?: string;
}

export default function ParallaxImage({ src, alt, className = "", sizes = "100vw", position }: Props & { sizes?: string; position?: string }) {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div
                style={{
                    y,
                    height: "120%",
                    willChange: "transform"
                }}
                className="relative w-full"
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    loading="lazy"
                    quality={85}
                    style={{ objectPosition: position }}
                    className="object-cover"
                />
            </motion.div>
        </div>
    );
}
