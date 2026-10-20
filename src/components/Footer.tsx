"use client";

import Link from 'next/link';
import { PORTES } from '@/data/architecture';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-wine-900 text-white/80 py-16 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">


                <div>
                    <div className="font-serif text-2xl text-white mb-6">Domaine de Garanches</div>
                    <p className="font-light text-sm leading-loose text-gray-300 mb-6">
                        345 chemin de Garanches<br />
                        69460 Odenas — France<br />
                        +33 4 74 03 44 80
                    </p>


                </div>


                <div className="flex flex-col items-center gap-4 text-sm uppercase tracking-widest font-semibold text-gray-300">
                    {PORTES.map((porte) => (
                        <Link key={porte.path} href={porte.path} className="hover:text-gold-500 transition-colors">{porte.label}</Link>
                    ))}
                    <Link href="/carnets" className="hover:text-gold-500 transition-colors">Les Carnets</Link>
                    <Link href="/acheter" className="hover:text-gold-500 transition-colors">Acheter / Trouver Garanches</Link>
                </div>


                <div className="flex flex-col items-center gap-4 text-sm uppercase tracking-widest font-semibold text-gray-300">
                    <Link href="/contact" className="hover:text-gold-500 transition-colors">Contact</Link>
                    <Link href="/mentions-legales" className="hover:text-gold-500 transition-colors">Mentions légales</Link>
                    <Link href="/politique-confidentialite" className="hover:text-gold-500 transition-colors">Confidentialité</Link>
                    <Link href="/cgv" className="hover:text-gold-500 transition-colors">CGV</Link>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-500 font-light">
                <p>&copy; {currentYear} Domaine de Garanches. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
            </div>
        </footer>
    );
}
