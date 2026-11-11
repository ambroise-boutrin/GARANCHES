"use client";

import Link from 'next/link';
import { PORTES } from '@/data/architecture';

const CONTACTS = [
    { name: 'Romain', number: '07 82 24 94 36', tel: '+33782249436' },
    { name: 'Aurélie', number: '06 58 83 46 80', tel: '+33658834680' },
    { name: 'Isabelle', number: '06 61 73 56 67', tel: '+33661735667' },
    { name: 'Michel', number: '06 09 41 97 02', tel: '+33609419702' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-wine-900 text-white/80 py-16 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
                <div>
                    <div className="font-serif text-2xl text-white mb-6 uppercase tracking-[0.04em]">Domaine de Garanches</div>
                    <address className="not-italic text-sm leading-relaxed text-gray-300">
                        345 chemin de Garanches<br />
                        69460 Odenas, France
                    </address>
                    <ul className="mt-6 inline-grid grid-cols-[auto_auto] gap-x-5 gap-y-1 md:gap-y-2 text-sm text-gray-300 text-left">
                        {CONTACTS.map((c) => (
                            <li key={c.tel} className="contents">
                                <span className="py-1 md:py-0">{c.name}</span>
                                <a href={`tel:${c.tel}`} className="py-1 md:py-0 tabular-nums hover:text-white">{c.number}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-center md:items-start gap-1 md:gap-4 text-sm uppercase tracking-widest font-semibold text-gray-300">
                    {PORTES.map((porte) => (
                        <Link key={porte.path} href={porte.path} className="py-2 md:py-0 hover:text-white transition-colors">{porte.label}</Link>
                    ))}
                    <Link href="/carnets" className="py-2 md:py-0 hover:text-white transition-colors">Les Carnets</Link>
                    <Link href="/acheter" className="py-2 md:py-0 hover:text-white transition-colors">Acheter / Trouver Garanches</Link>
                </div>

                <div className="flex flex-col items-center md:items-start gap-1 md:gap-4 text-sm uppercase tracking-widest font-semibold text-gray-300">
                    <Link href="/contact" className="py-2 md:py-0 hover:text-white transition-colors">Contact</Link>
                    <Link href="/mentions-legales" className="py-2 md:py-0 hover:text-white transition-colors">Mentions légales</Link>
                    <Link href="/politique-confidentialite" className="py-2 md:py-0 hover:text-white transition-colors">Confidentialité</Link>
                    <Link href="/cgv" className="py-2 md:py-0 hover:text-white transition-colors">CGV</Link>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-400">
                <p>&copy; {currentYear} Domaine de Garanches. L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</p>
            </div>
        </footer>
    );
}
