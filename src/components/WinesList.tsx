"use client";

import Image from "next/image";
import Link from "@/components/Lien";
import RequestBottlesButton from "@/components/RequestBottlesButton";
import FadeIn from "@/components/FadeIn";
import { cuveeHref, nomMillesime } from "@/lib/wineSlug";
import { useTexte, useUi } from "@/components/Contenu";

export default function WinesList({ wines }: { wines: any[] }) {
    const ui = useUi();
    const decouvrir = useTexte("cuvees.decouvrir");
    const questionTitre = useTexte("cuvees.question.titre");
    const questionTexte = useTexte("cuvees.question.texte");
    const questionLien = useTexte("cuvees.question.lien");

    return (
        <div className="pb-8">

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">

                    {wines.map((wine: any, index: number) => (
                        <FadeIn key={wine.id} delay={index * 0.1}>
                            <div className="group relative flex flex-col md:flex-row gap-4 md:gap-8 items-center bg-white p-4 md:p-10 border border-gray-100 hover:border-wine-200 transition-colors">

                                <div className="w-full md:w-1/3 h-72 md:h-80 relative flex-shrink-0 bg-gray-50 overflow-hidden" data-sanity={wine.cliquerImage}>
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <Image
                                            src={wine.image || "/images/bouteilles/brouilly.jpg"}
                                            alt={ui.vinDomaine(nomMillesime(wine))}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            loading="lazy"
                                            quality={80}
                                            className="object-contain mix-blend-multiply p-2 md:p-4"
                                        />
                                    </div>
                                </div>

                                <div className="w-full md:w-2/3 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                                        <h2 className="normal-case tracking-normal text-3xl font-serif text-wine-900"><Link href={cuveeHref(wine)} className="group-hover:text-red-900 transition-colors after:absolute after:inset-0 after:content-['']">{nomMillesime(wine)}</Link></h2>
                                    </div>

                                    <p className="text-wine-700 text-sm font-bold mb-4">
                                        {wine.subtitle || "Domaine de Garanches"}
                                    </p>

                                    <Link href={cuveeHref(wine)} className="inline-block mb-6 text-base underline underline-offset-4 decoration-1 text-red-900 hover:text-red-700 transition-colors">
                                        {decouvrir}
                                    </Link>

                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-xs text-gray-700 mb-6">
                                        {wine.volume && <span>{wine.volume}</span>}
                                                                                <span className="border-l border-gray-300 pl-3" title={ui.grossesse}>
                                            <svg viewBox="0 0 64 64" role="img" aria-label={ui.grossesse} className="w-5 h-5 opacity-60 fill-current text-gray-600">
                                                <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <line x1="12" y1="52" x2="52" y2="12" stroke="currentColor" strokeWidth="3" />
                                                <path d="M32 10a10 10 0 0 1 10 10c0 5-4 15-10 15s-10-10-10-15a10 10 0 0 1 10-10z" fill="currentColor" />
                                                <path d="M32 35c-8 0-14 6-14 14v5h28v-5c0-8-6-14-14-14z" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                                        {wine.tags?.filter((tag: string) => ["gamay", "chardonnay", "pinot noir", "aligoté"].includes(tag.trim().toLowerCase())).map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-wine-50 text-wine-800 text-xs border border-wine-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="relative z-10">{/* au-dessus du lien de la carte */}<RequestBottlesButton wine={wine} /></div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}

                </div>
            </div>

            <FadeIn direction="up">
                <div className="mt-32 py-16 bg-wine-900 text-white text-center px-4">
                    <h3 className="text-3xl font-serif mb-4">{questionTitre}</h3>
                    <p className="opacity-80 mb-8 max-w-xl mx-auto">
                        {questionTexte}
                    </p>
                    <Link href="/contact" className="border-b border-white text-white pb-1 hover:text-white hover:border-white transition-colors text-base">
                        {questionLien}
                    </Link>
                </div>
            </FadeIn>

        </div>
    );
}

