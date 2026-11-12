"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { flou } from "@/data/flous";

interface Props {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    position?: string;
    // Effet de parallaxe au défilement : photos placées à côté d'un texte (accueil et blocs des pages).
    parallaxe?: boolean;
    // Aperçu flou d'une photo venue du studio Sanity.
    blur?: string;
}

export default function ParallaxImage({ src, alt, className = "", sizes = "100vw", position, parallaxe = false, blur }: Props) {
    const cadre = useRef<HTMLDivElement>(null);
    const calque = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!parallaxe) return;
        const el = cadre.current;
        const img = calque.current;
        if (!el || !img) return;

        let raf = 0;
        const maj = () => {
            raf = 0;
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            // 0 quand le haut du cadre entre en bas de l'écran, 1 quand son bas sort en haut.
            const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
            // Le calque dépasse de 20 % en haut et en bas : il glisse de ±20 % de la hauteur du cadre sur ordinateur, ±6 % sur téléphone (plus discret).
            img.style.transform = `translate3d(0, ${((2 * p - 1) * (window.innerWidth < 768 ? 0.06 : 0.2) * r.height).toFixed(1)}px, 0)`;
        };
        const demander = () => {
            if (!raf) raf = requestAnimationFrame(maj);
        };
        maj();
        window.addEventListener("scroll", demander, { passive: true });
        window.addEventListener("resize", demander);
        return () => {
            window.removeEventListener("scroll", demander);
            window.removeEventListener("resize", demander);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [parallaxe]);

    const image = (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            loading="lazy"
            quality={75}
            {...flou(src, blur)}
            style={{ objectPosition: position }}
            className="object-cover"
        />
    );

    return (
        <div ref={cadre} className={`relative overflow-hidden ${className}`}>
            {parallaxe ? (
                <div ref={calque} className="absolute inset-x-0 top-[-6%] h-[112%] md:top-[-20%] md:h-[140%] will-change-transform">
                    {image}
                </div>
            ) : (
                image
            )}
        </div>
    );
}
