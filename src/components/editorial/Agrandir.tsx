"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Document ouvert en grand sur la même page (pas de nouvel onglet) ; un toucher ou Échap le referme.
export default function Agrandir({ src, alt }: { src: string; alt: string }) {
    const [ouvert, setOuvert] = useState(false);

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
            <button type="button" onClick={() => setOuvert(true)} className="absolute inset-0 cursor-zoom-in" aria-label={`Voir en grand : ${alt || "document"}`} />
            {ouvert && (
                <div role="dialog" aria-modal="true" aria-label={alt || "Document"} className="fixed inset-0 z-[200] bg-stone-900" onClick={() => setOuvert(false)}>
                    <Image src={src} alt={alt} fill sizes="100vw" quality={90} className="object-contain p-2 md:p-8" />
                    <button type="button" onClick={() => setOuvert(false)} className="absolute top-4 right-4 px-4 py-2 bg-white text-stone-900 text-sm font-medium">
                        Fermer
                    </button>
                </div>
            )}
        </>
    );
}
