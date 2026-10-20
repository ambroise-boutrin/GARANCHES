"use client";
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { SOUS_NAV_ID } from '@/components/editorial/SousNav';

export default function SmoothScroll() {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Courbe d'accélération douce
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // Reset du scroll à chaque changement de page, sauf depuis la barre d'un univers :
    // on reste alors au niveau de cette barre.
    useEffect(() => {
        let top = 0;
        if (sessionStorage.getItem("garder-sous-nav")) {
            sessionStorage.removeItem("garder-sous-nav");
            const barre = document.getElementById(SOUS_NAV_ID);
            if (barre) top = barre.getBoundingClientRect().top + window.scrollY - 64;
        }
        if (lenisRef.current) {
            lenisRef.current.scrollTo(top, { immediate: true });
        } else {
            window.scrollTo(0, top);
        }
    }, [pathname]);

    return null;
}
