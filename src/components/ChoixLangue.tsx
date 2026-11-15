"use client";

import { usePathname } from "next/navigation";
import { useLangue, useUi } from "@/components/Contenu";
import { COOKIE_LANGUE, lienLangue, sansLangue } from "@/lib/langue";

// Bouton FR / EN : la même page dans l'autre langue. Le choix est retenu un an (cookie lu par src/middleware.ts),
// pour qu'un visiteur étranger qui préfère le français (ou l'inverse) ne soit plus redirigé.
// Lien classique (pas de navigation instantanée) : la page suivante est demandée avec le nouveau cookie.
export default function ChoixLangue({ className = "", long = false }: { className?: string; long?: boolean }) {
    const langue = useLangue();
    const ui = useUi();
    const chemin = sansLangue(usePathname() || "/");
    const autre = langue === "fr" ? "en" : "fr";
    const href = lienLangue(chemin, autre);

    return (
        <a
            href={href}
            hrefLang={autre}
            lang={autre}
            aria-label={ui.autreLangueAria}
            title={ui.autreLangueAria}
            onClick={(e) => {
                document.cookie = `${COOKIE_LANGUE}=${autre}; path=/; max-age=31536000; SameSite=Lax`;
                // Garde la question posée dans l'adresse (?theme=…) et l'endroit de la page (#formulaire).
                e.currentTarget.href = href + window.location.search + window.location.hash;
            }}
            className={className}
        >
            {long ? ui.autreLangue : ui.autreLangueCourt}
        </a>
    );
}
