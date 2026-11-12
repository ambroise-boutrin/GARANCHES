"use client";

import { useEffect } from "react";
import { getImageProps } from "next/image";
import { PAGES, CARNETS_CARD } from "@/data/architecture";
import { useContenu } from "@/components/Contenu";
import type { ContenuSite } from "@/sanity/lib/contenuTypes";

// Photo du haut de la page visée par un lien (mêmes réglages que PageHero, pour réutiliser le même fichier).
function photoDuHaut(chemin: string, contenu: ContenuSite): string | undefined {
    const path = chemin.replace(/^\/+|\/+$/g, "").split(/[?#]/)[0];
    // Photo changée dans le studio.
    if (contenu.pages[path]?.photo) return contenu.pages[path].photo!.src;
    if (/^les-vins\/cuvees\/[^/]+$/.test(path) && contenu.photos["cuvees.fiche.photo"]) return contenu.photos["cuvees.fiche.photo"].src;
    if (path === "carnets") return CARNETS_CARD.image;
    if (PAGES[path]) return PAGES[path].image;
    // Fiche d'une cuvée : même bandeau pour toutes.
    if (/^les-vins\/cuvees\/[^/]+$/.test(path)) return "/images/23_slide002.jpg";
    return undefined;
}

// Dès que le doigt touche un lien (ou que la souris le survole), la photo du haut de la page suivante
// commence à charger : elle est souvent déjà là quand la page s'ouvre.
export default function PrechargePhotos() {
    const contenu = useContenu();
    useEffect(() => {
        const dejaFaites = new Set<string>();
        const precharger = (e: Event) => {
            const lien = (e.target as Element | null)?.closest?.("a[href^='/']");
            if (!lien) return;
            const src = photoDuHaut(lien.getAttribute("href") || "", contenu);
            if (!src || dejaFaites.has(src)) return;
            dejaFaites.add(src);
            const { props } = getImageProps({ src, alt: "", fill: true, sizes: "100vw", quality: 75 });
            const img = new window.Image();
            img.fetchPriority = "high";
            if (props.sizes) img.sizes = props.sizes;
            if (props.srcSet) img.srcset = props.srcSet;
            img.src = props.src;
        };
        document.addEventListener("pointerover", precharger, { passive: true });
        document.addEventListener("touchstart", precharger, { passive: true });
        document.addEventListener("focusin", precharger);
        return () => {
            document.removeEventListener("pointerover", precharger);
            document.removeEventListener("touchstart", precharger);
            document.removeEventListener("focusin", precharger);
        };
    }, [contenu]);
    return null;
}
