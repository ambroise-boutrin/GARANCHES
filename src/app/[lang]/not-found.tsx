import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/Lien";
import { flou } from "@/data/flous";
import { UI } from "@/i18n/ui";
import { langueCourante } from "@/lib/langueServeur";

export const metadata: Metadata = {
    robots: { index: false, follow: true },
};

const PHOTO = "/images/garanches/verre-dans-les-vignes.jpg";

// Page affichée pour toute adresse qui n'existe pas (ou plus) sur le site, dans la langue de la page.
// Fond clair en haut, pour que le menu (texte foncé sur les pages sans grande photo) reste lisible.
export default function NotFound() {
    const ui = UI[langueCourante()];
    return (
        <main className="bg-stone-50 pt-24 md:pt-32">
            <div className="max-w-6xl mx-auto md:grid md:grid-cols-2 md:gap-16 md:items-start md:px-6 md:pb-16">
                <div className="px-6 pb-12 md:px-0 md:pb-0">
                    <h1 className="font-serif font-semibold uppercase text-4xl md:text-5xl leading-[1.1] text-stone-900 mb-4">
                        {ui.introuvableTitre}
                    </h1>
                    <p className="text-lg text-stone-800 leading-relaxed mb-8 max-w-md">
                        {ui.introuvableTexte}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/" className="block text-center px-8 py-4 bg-stone-900 text-white text-base hover:bg-stone-700 transition-colors">
                            {ui.retourAccueil}
                        </Link>
                        <Link href="/les-vins/cuvees" className="block text-center px-8 py-4 border border-stone-900 text-stone-900 text-base hover:bg-stone-900 hover:text-white transition-colors">
                            {ui.voirVins}
                        </Link>
                        <Link href="/contact" className="block text-center px-8 py-4 border border-stone-900 text-stone-900 text-base hover:bg-stone-900 hover:text-white transition-colors">
                            {ui.nousContacter}
                        </Link>
                    </div>
                </div>
                <div className="relative w-full aspect-[4/3] md:aspect-[4/3]">
                    <Image
                        src={PHOTO}
                        alt={ui.altIntrouvable}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        quality={75}
                        {...flou(PHOTO)}
                        className="object-cover"
                    />
                </div>
            </div>
        </main>
    );
}
