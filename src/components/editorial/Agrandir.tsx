"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUi } from "@/components/Contenu";

// Document ouvert en grand sur la même page (pas de nouvel onglet) ; un toucher ou Échap le referme.
export default function Agrandir({ src, alt }: { src: string; alt: string }) {
    const [ouvert, setOuvert] = useState(false);
    const ui = useUi();

    useEffect(() => {
        if (!ouvert) return;
        const fermer = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
        const avant = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", fermer);
        return () => {
            document.body.style.overflow = avant;
            window.removeEventListener("keydown", fermer);
        };
    }, [ouvert]);

    return (
        <>
            <button type="button" onClick={() => setOuvert(true)} className="absolute inset-0 cursor-zoom-in" aria-label={ui.voirEnGrand(alt)} />
            {ouvert && (
                <div role="dialog" aria-modal="true" aria-label={alt || ui.document} className="fixed inset-0 z-[200] bg-stone-900" onClick={() => setOuvert(false)}>
                    <Image src={src} alt={alt} fill sizes="100vw" quality={90} className="object-contain p-2 md:p-8" />
                    <button type="button" onClick={() => setOuvert(false)} className="absolute top-4 right-4 px-4 py-2 bg-white text-stone-900 text-sm font-medium">
                        {ui.fermer}
                    </button>
                </div>
            )}
        </>
    );
}
