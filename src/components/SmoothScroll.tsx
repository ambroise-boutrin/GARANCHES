"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { estNavigationDouce, finNavigationDouce } from '@/lib/navigationDouce';

// Défilement natif du navigateur (plus de défilement « glissé » artificiel).
// Retour en haut à chaque changement de page, sauf depuis la barre d'un univers :
// on reste alors exactement au même endroit. Une adresse avec ancre (/contact#formulaire)
// arrive directement sur l'élément visé.
export default function SmoothScroll() {
    const pathname = usePathname();

    useEffect(() => {
        if (estNavigationDouce()) {
            finNavigationDouce();
            return;
        }
        const ancre = decodeURIComponent(window.location.hash.slice(1));
        const cible = ancre ? document.getElementById(ancre) : null;
        if (cible) {
            cible.scrollIntoView();
            return;
        }
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
