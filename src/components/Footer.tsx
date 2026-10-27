"use client";

import Link from 'next/link';
import { PORTES } from '@/data/architecture';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-wine-900 text-white/80 py-16 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">


                <div>
                    <div className="font-serif text-2xl text-white mb-6 uppercase tracking-[0.04em]">Domaine de Garanches</div>
                    <p className="font-light text-sm leading-loose text-gray-300 mb-6">
                        345 chemin de Garanches<br />
                        69460 Odenas — France<br />
                        <a href="tel:+33782249436" className="inline-block py-1 hover:text-white">Romain : 07 82 24 94 36</a><br />
                        <a href="tel:+33658834680" className="inline-block py-1 hover:text-white">Aurélie : 06 58 83 46 80</a>
                    </p>


                </div>


                <div className="flex flex-col items-center gap-1 md:gap-4 text-sm uppercase tracking-widest font-semibold text-gray-300">
                    {PORTES.map((porte) => (
                        <Link key={porte.path} href={porte.path} className="py-2 md:py-0 hover:text-white transition-colors">{porte.label}</Link>
                    ))}
                    <Link href="/carnets" className="py-2 md:py-0 hover:text-white transition-colors">Les Carnets</Link>
                    <Link href="/acheter" className="py-2 md:py-0 hover:text-white transition-colors">Acheter / Trouver Garanches</Link>
                </div>


                <div className="flex flex-col items-center gap-1 md:gap-4 text-sm uppercase tracking-widest font-semibold text-gray-300">
                    <Link href="/contact" className="py-2 md:py-0 hover:text-white transition-colors">Contact</Link>
                    <Link href="/mentions-legales" className="py-2 md:py-0 hover:text-white transition-colors">Mentions légales</Link>
                    <Link href="/politique-confidentialite" className="py-2 md:py-0 hover:text-white transition-colors">Confidentialité</Link>
                    <Link href="/cgv" className="py-2 md:py-0 hover:text-white transition-colors">CGV</Link>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-500 font-light">
                <p>&copy; {currentYear} Domaine de Garanches. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
            </div>
        </footer>
    );
}
