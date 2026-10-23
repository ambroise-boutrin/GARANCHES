"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PORTES } from "@/data/architecture";
import { marquerNavigationDouce } from "@/lib/navigationDouce";

// Barre des pages d'une même porte, sous la photo d'ouverture.
// Un clic change de page sans animation ni retour en haut : on reste au même endroit (voir SmoothScroll).
export const SOUS_NAV_ID = "sous-nav";

// `current` sert aux pages qui ont leur propre route (les Carnets, rangés sous Le Lieu).
export default function SousNav({ path, current = `/${path}` }: { path: string; current?: string }) {
    const liste = useRef<HTMLUListElement>(null);
    // Sur téléphone, la barre défile : on amène la page en cours à l'écran.
    useEffect(() => {
        const ul = liste.current;
        const actif = ul?.querySelector<HTMLElement>('[aria-current="page"]');
        if (ul && actif) ul.scrollLeft = actif.offsetLeft - (ul.clientWidth - actif.offsetWidth) / 2;
    }, [current]);

    const porte = PORTES.find((p) => p.path === `/${path.split("/")[0]}`);
    if (!porte) return null;

    return (
        <nav id={SOUS_NAV_ID} aria-label={porte.label} className="relative bg-paper border-b border-stone-200">
            <ul ref={liste} className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {[{ label: porte.label, href: porte.path }, ...porte.children].map((item) => {
                    const active = item.href === current;
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                scroll={false}
                                onClick={marquerNavigationDouce}
                                aria-current={active ? "page" : undefined}
                                className={`block py-5 text-xs uppercase tracking-widest font-medium border-b-2 transition-colors ${active ? "border-wine-900 text-wine-900" : "border-transparent text-gray-500 hover:text-wine-900"}`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
                <li aria-hidden className="w-2 shrink-0" />
            </ul>
            {/* Indique sur téléphone que la barre continue à droite. */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-paper lg:hidden" />
        </nav>
    );
}
