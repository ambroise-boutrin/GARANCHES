"use client";

import Link from 'next/link';
import { Lignes, useContenu, usePortes, useTexte } from '@/components/Contenu';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const portes = usePortes();
    const { pages } = useContenu();
    const nom = useTexte('pied.nom');
    const adresse = useTexte('pied.adresse');
    const contact = useTexte('pied.contact');
    const mention = useTexte('pied.mention');

    return (
        <footer className="bg-wine-900 text-white/80 py-16 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/logo-maison.png" alt="" width={539} height={284} className="w-28 h-auto mx-auto md:mx-0 mb-4" />
                    <div className="font-serif text-2xl text-white mb-6 uppercase tracking-[0.04em]">{nom}</div>
                    <address className="not-italic text-sm leading-relaxed text-gray-300">
                        <Lignes texte={adresse} />
                    </address>
                    <div className="mt-6 text-sm">
                        <Link href="/contact" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">{contact}</Link>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start gap-1 md:gap-4 text-sm uppercase tracking-widest font-semibold text-gray-300">
                    {portes.map((porte) => (
                        <Link key={porte.path} href={porte.path} className="py-2 md:py-0 hover:text-white transition-colors">{porte.label}</Link>
                    ))}
                    <Link href="/carnets" className="py-2 md:py-0 hover:text-white transition-colors">{pages.carnets?.titre ?? "Les Carnets"}</Link>
                    <Link href="/acheter" className="py-2 md:py-0 hover:text-white transition-colors">{pages.acheter?.titre ?? "Acheter / Trouver Garanches"}</Link>
                </div>

                <div className="flex flex-col items-center md:items-start gap-1 md:gap-4 text-sm uppercase tracking-widest font-semibold text-gray-300">
                    <Link href="/contact" className="py-2 md:py-0 hover:text-white transition-colors">Contact</Link>
                    <Link href="/mentions-legales" className="py-2 md:py-0 hover:text-white transition-colors">Mentions légales</Link>
                    <Link href="/politique-confidentialite" className="py-2 md:py-0 hover:text-white transition-colors">Confidentialité</Link>
                    <Link href="/cgv" className="py-2 md:py-0 hover:text-white transition-colors">CGV</Link>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-gray-400">
                <p>&copy; {currentYear} {mention}</p>
            </div>
        </footer>
    );
}
