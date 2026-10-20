"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import FadeIn from "@/components/FadeIn";
import { cuveeHref } from "@/lib/wineSlug";

export default function WinesList({ wines }: { wines: any[] }) {

    return (
        <div className="pb-8">

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">

                    {wines.map((wine: any, index: number) => (
                        <FadeIn key={wine.id} delay={index * 0.1}>
                            <div className="group flex flex-col md:flex-row gap-4 md:gap-8 items-center bg-white p-4 md:p-10 shadow-sm hover:shadow-md transition-shadow border border-gray-100 rounded-lg">

                                <div className="w-full md:w-1/3 h-64 md:h-80 relative flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <Image
                                            src={wine.image || "/images/36_brouilly-h.jpg"}
                                            alt={`${wine.name} - Domaine de Garanches`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            loading="lazy"
                                            quality={80}
                                            className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2 md:p-4"
                                        />
                                    </div>
                                </div>

                                <div className="w-full md:w-2/3 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-2">
                                        <h2 className="text-3xl font-serif text-wine-900"><Link href={cuveeHref(wine)} className="hover:text-amber-700 transition-colors">{wine.name}</Link></h2>
                                        <span className="text-xl font-bold text-gold-500 mt-2 md:mt-0 whitespace-nowrap">
                                            {(wine.price / 100).toFixed(2).replace('.', ',')} €
                                        </span>
                                    </div>

                                    <p className="text-wine-700 text-sm uppercase tracking-widest font-bold mb-4">
                                        {wine.subtitle || "Domaine de Garanches"}
                                    </p>

                                    <p className="text-gray-600 font-light text-sm leading-relaxed mb-6 line-clamp-3">
                                        {/* Description non traduite car dynamique */}
                                        {wine.description}
                                    </p>

                                    <Link href={cuveeHref(wine)} className="inline-block mb-6 text-xs uppercase tracking-widest font-bold text-red-900 hover:text-amber-600 transition-colors">
                                        Découvrir la cuvée →
                                    </Link>

                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-6 font-light">
                                        {wine.volume && <span>{wine.volume}</span>}
                                        {wine.alcohol && <span className="border-l border-gray-300 pl-4">{wine.alcohol}</span>}
                                        {wine.price && wine.volume && (
                                            <span className="border-l border-gray-300 pl-4 text-gray-400 italic">
                                                Soit {((wine.price / 100) / (parseFloat(wine.volume) === 1.5 ? 1.5 : 0.75)).toFixed(2).replace('.', ',')} €/L
                                            </span>
                                        )}
                                        {wine.allergens && (
                                            <span className="border-l border-gray-300 pl-4 text-[10px] uppercase tracking-wider text-gray-400">
                                                {wine.allergens}
                                            </span>
                                        )}
                                        <span className="border-l border-gray-300 pl-3" title="Déconseillé aux femmes enceintes">
                                            <svg viewBox="0 0 64 64" className="w-5 h-5 opacity-60 fill-current text-gray-400">
                                                <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <line x1="12" y1="52" x2="52" y2="12" stroke="currentColor" strokeWidth="3" />
                                                <path d="M32 10a10 10 0 0 1 10 10c0 5-4 15-10 15s-10-10-10-15a10 10 0 0 1 10-10z" fill="currentColor" />
                                                <path d="M32 35c-8 0-14 6-14 14v5h28v-5c0-8-6-14-14-14z" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                                        {wine.tags?.map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-wine-50 text-wine-800 text-xs border border-wine-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <AddToCartButton wine={wine} />
                                </div>
                            </div>
                        </FadeIn>
                    ))}

                </div>
            </div>

            <FadeIn direction="up">
                <div className="mt-32 py-16 bg-wine-900 text-white text-center px-4">
                    <h3 className="text-3xl font-serif mb-4">Une question sur un millésime ?</h3>
                    <p className="font-light opacity-80 mb-8 max-w-xl mx-auto">
                        N'hésitez pas à nous contacter pour connaître les tarifs d'expédition ou pour passer commande directement.
                    </p>
                    <Link href="/contact" className="border-b border-gold-500 text-gold-500 pb-1 hover:text-white hover:border-white transition-colors uppercase text-xs tracking-widest font-bold">
                        Contactez-nous
                    </Link>
                </div>
            </FadeIn>

        </div>
    );
}

