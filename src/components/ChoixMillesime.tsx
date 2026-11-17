"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RequestBottlesButton from "@/components/RequestBottlesButton";
import RichText from "@/components/editorial/RichText";
import { nomMillesime } from "@/lib/wineSlug";
import { useUi } from "@/components/Contenu";

type Caracteristique = { label: string; value?: string };

function Caracteristiques({ items }: { items: Caracteristique[] }) {
    const remplis = items.filter((d) => d.value);
    if (!remplis.length) return null;
    return (
        <dl className="grid grid-cols-2 gap-4">
            {remplis.map((d) => (
                <div key={d.label} className="bg-white border border-stone-200 p-4">
                    <dt className="text-red-900 text-sm font-bold mb-1">{d.label}</dt>
                    <dd className="text-gray-700 text-sm">{d.value}</dd>
                </div>
            ))}
        </dl>
    );
}

// Une seule bouteille ; un clic sur une année change la description sur place, sans charger de nouvelle page.
// Tous les millésimes sont dans la page (lus par Google), seul celui choisi est affiché.
// L'année choisie s'inscrit dans l'adresse (#2024), ce qui permet de partager un millésime précis.
export default function ChoixMillesime({
    millesimes,
    image,
    cliquerImage,
    nom,
    communs,
    titreParcelle,
    titreVinification,
}: {
    millesimes: any[];
    image: string;
    cliquerImage?: string;
    nom: string;
    communs: Caracteristique[];
    titreParcelle: string;
    titreVinification: string;
}) {
    const ui = useUi();
    const cle = (w: any) => String(w.millesime || w.id);
    const [choisi, setChoisi] = useState(cle(millesimes[0]));

    useEffect(() => {
        const lire = () => {
            const ancre = decodeURIComponent(window.location.hash.slice(1));
            if (millesimes.some((w) => cle(w) === ancre)) setChoisi(ancre);
        };
        lire();
        window.addEventListener("hashchange", lire);
        return () => window.removeEventListener("hashchange", lire);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const choisir = (valeur: string) => {
        setChoisi(valeur);
        window.history.replaceState(null, "", `#${valeur}`);
    };

    return (
        <section className="pt-10 pb-16 md:py-24 bg-stone-50">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6 md:gap-20 items-start">
                <div className="relative h-[260px] md:h-[520px] bg-white md:sticky md:top-28" data-sanity={cliquerImage}>
                    <Image src={image} alt={ui.bouteilleDomaine(nom)} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-8 mix-blend-multiply" />
                </div>
                <div>
                    {millesimes.length > 0 && (
                        <div role="tablist" aria-label={ui.millesimes} className="flex flex-wrap gap-3 mb-6 md:mb-10">
                            {millesimes.map((w) => {
                                const actif = cle(w) === choisi;
                                return (
                                    <button
                                        key={w.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={actif}
                                        onClick={() => choisir(cle(w))}
                                        className={`px-6 py-2 border border-wine-900 text-base transition-colors ${actif ? "bg-wine-900 text-white" : "text-wine-900 hover:bg-wine-50"}`}
                                    >
                                        {w.millesime}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {millesimes.map((w) => (
                        <div key={w.id} id={cle(w)} role="tabpanel" hidden={cle(w) !== choisi} className="scroll-mt-28">
                            <h2 className="normal-case tracking-normal text-3xl md:text-5xl font-serif text-red-900 mb-6 leading-tight">{nomMillesime(w)}</h2>
                            {w.description && <RichText text={w.description} className="text-gray-800 leading-relaxed text-base md:text-lg" />}
                            <div className="mt-8">
                                <Caracteristiques items={[...communs, { label: ui.alcool, value: w.alcohol }]} />
                            </div>
                            {w.parcelle && (
                                <div className="mt-10">
                                    <h3 className="text-2xl md:text-3xl font-serif text-wine-900 mb-4">{titreParcelle}</h3>
                                    <RichText text={w.parcelle} className="text-gray-800 leading-relaxed text-base md:text-lg" />
                                </div>
                            )}
                            {w.vinification && (
                                <div className="mt-10">
                                    <h3 className="text-2xl md:text-3xl font-serif text-wine-900 mb-4">{titreVinification}</h3>
                                    <RichText text={w.vinification} className="text-gray-800 leading-relaxed text-base md:text-lg" />
                                </div>
                            )}
                            <RequestBottlesButton wine={w} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
