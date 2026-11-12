"use client";

import { VisualEditing } from "next-sanity";
import { usePathname } from "next/navigation";

// Aperçu ouvert depuis le studio : textes cliquables, et un lien pour revenir au site public
// si la page est ouverte en dehors du studio.
export default function ApercuStudio() {
    const chemin = usePathname();
    const dansStudio = typeof window !== "undefined" && window.self !== window.top;
    return (
        <>
            <VisualEditing />
            {!dansStudio && (
                <a
                    href={`/api/draft-mode/disable?retour=${encodeURIComponent(chemin || "/")}`}
                    className="fixed bottom-4 left-4 z-[100] bg-stone-900 text-white text-sm px-4 py-2"
                >
                    Quitter l&apos;aperçu
                </a>
            )}
        </>
    );
}
