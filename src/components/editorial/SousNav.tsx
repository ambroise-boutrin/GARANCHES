"use client";

import Link from "next/link";
import { PORTES } from "@/data/architecture";

// Barre des pages d'une même porte, sous la photo d'ouverture.
// Un clic garde la barre en haut de l'écran au lieu de remonter à la photo (voir SmoothScroll).
export const SOUS_NAV_ID = "sous-nav";

export default function SousNav({ path }: { path: string }) {
    const porte = PORTES.find((p) => p.path === `/${path.split("/")[0]}`);
    if (!porte) return null;
    const current = `/${path}`;

    return (
        <nav id={SOUS_NAV_ID} aria-label={porte.label} className="bg-paper border-b border-stone-200">
            <ul className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto whitespace-nowrap">
                {[{ label: porte.label, href: porte.path }, ...porte.children].map((item) => {
                    const active = item.href === current;
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                scroll={false}
                                onClick={() => sessionStorage.setItem("garder-sous-nav", "1")}
                                aria-current={active ? "page" : undefined}
                                className={`block py-5 text-xs uppercase tracking-widest font-medium border-b-2 transition-colors ${active ? "border-amber-500 text-wine-900" : "border-transparent text-gray-500 hover:text-wine-900"}`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
