import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata } from "next";
import Image from "next/image";
import { flou } from "@/data/flous";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import RequestBottlesButton from "@/components/RequestBottlesButton";
import RichText from "@/components/editorial/RichText";
import PageCards from "@/components/editorial/PageCards";
import { getWine } from "@/lib/wines";
import { cuveeHref } from "@/lib/wineSlug";
import { prixAffiche } from "@/lib/prix";
import { getContenuSite } from "@/sanity/lib/contenu";
import { photoDe, texteDe } from "@/lib/contenu";
import { SITE_NAME, WINERY_ID, absolu, filAriane, partage } from "@/lib/site";

export const revalidate = 60;

// Une page par cuvée, sous Les Vins › Les cuvées.
type Props = { params: { porte: string; page: string; cuvee: string } };

async function load({ porte, page, cuvee }: Props["params"]) {
    if (porte !== "les-vins" || page !== "cuvees") return null;
    return getWine(cuvee);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const wine = (await load(params))?.wine;
    if (!wine) return {};
    const title = titreGoogle(wine);
    const description = resume(`${nomComplet(wine)} du domaine de Garanches, à Odenas au pied du Mont Brouilly. ${wine.description || ""}`);
    return {
        title,
        description,
        alternates: { canonical: cuveeHref(wine) },
        ...partage({
            chemin: cuveeHref(wine),
            titre: `${nomComplet(wine)} | ${SITE_NAME}`,
            description,
            image: image(wine),
            alt: `Bouteille de ${nomComplet(wine)}, domaine de Garanches`,
        }),
    };
}

// « Brouilly 2023 » : nom suivi du millésime quand il est connu.
function nomComplet(wine: any): string {
    return wine.millesime ? `${wine.name} ${wine.millesime}` : wine.name;
}

// Titre pour Google : le nom, puis seulement les mots du sous-titre qui n'y sont pas déjà
// (« Beaujolais-Villages blanc 2025 » plutôt que « … – Beaujolais-Villages — Blanc »).
function titreGoogle(wine: any): string {
    const nom = nomComplet(wine);
    const reste = String(wine.subtitle || "")
        .split(/\s+[—–-]\s+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s && !nom.toLowerCase().includes(s.toLowerCase()));
    if (!reste.length) return nom;
    const suite = reste.map((s: string, i: number) => (i === 0 ? s : s.charAt(0).toLowerCase() + s.slice(1))).join(" ");
    return `${nom} – ${suite}`;
}

// Description pour Google : coupée proprement vers 155 caractères.
function resume(texte: string) {
    const propre = texte.replace(/\s+/g, " ").trim();
    if (propre.length <= 155) return propre;
    return propre.slice(0, 154).replace(/\s+\S*$/, "") + "…";
}

function image(wine: any): string {
    return absolu(wine.image || "/images/bouteilles/brouilly.jpg");
}

function Section({ title, text, background }: { title: string; text?: string; background: string }) {
    return (
        <section className={`py-16 md:py-24 ${background}`}>
            <FadeIn className="max-w-3xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-serif text-red-900 mb-6">{title}</h2>
                {text ? (
                    <RichText text={text} className="text-gray-800 leading-relaxed text-base md:text-lg" />
                ) : (
                    <p className="text-gray-600">Texte à venir.</p>
                )}
            </FadeIn>
        </section>
    );
}

export default async function CuveePage({ params }: Props) {
    const data = await load(params);
    if (!data?.wine) notFound();
    const { wine, wines } = data;
    const contenu = await getContenuSite();
    const photoHaut = photoDe(contenu, "cuvees.fiche.photo");
    const pageCuvees = contenu.pages["les-vins/cuvees"]?.titre ?? "Les cuvées";
    const autres = wines.filter((w: any) => w.id !== wine.id);

    return (
        <main className="min-h-screen text-gray-800 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serialiserJsonLd({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: nomComplet(wine),
                        description: wine.description,
                        image: image(wine),
                        url: absolu(cuveeHref(wine)),
                        brand: { "@type": "Brand", name: SITE_NAME },
                        manufacturer: { "@id": WINERY_ID },
                        category: "Vin",
                        countryOfOrigin: "FR",
                        ...(typeof wine.price === "number" && {
                            offers: {
                                "@type": "Offer",
                                priceCurrency: "EUR",
                                price: (wine.price / 100).toFixed(2),
                                availability: wine.enVente === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                                url: absolu(cuveeHref(wine)),
                                seller: { "@id": WINERY_ID },
                            },
                        }),
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serialiserJsonLd(filAriane([
                        { nom: "Les Vins", chemin: "/les-vins" },
                        { nom: "Les cuvées", chemin: "/les-vins/cuvees" },
                        { nom: nomComplet(wine), chemin: cuveeHref(wine) },
                    ])),
                }}
            />
            <section className="relative h-[60vh] min-h-[420px] flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0" data-sanity={photoHaut.cliquer}>
                    <Image src={photoHaut.src} alt="Vendanges à la main dans les vignes du Beaujolais" fill sizes="100vw" priority quality={75} {...flou(photoHaut.src, photoHaut.blur)} style={{ objectPosition: photoHaut.position }} className="object-cover brightness-[.6]" />
                </div>
                <FadeIn direction="down" className="relative text-center px-4 pt-20 flex flex-col items-center">
                    <Link href="/les-vins/cuvees" className="text-sm md:text-base text-white underline underline-offset-4 decoration-1">
                        {pageCuvees}
                    </Link>
                    <h1 className="normal-case tracking-normal font-serif text-4xl sm:text-5xl md:text-7xl leading-tight text-white mt-4 mb-4">{wine.name}</h1>
                    {wine.subtitle && <p className="text-white/80 text-sm mb-6">{wine.subtitle}</p>}
                    <div className="w-16 h-0.5 md:w-24 md:h-1 bg-white"></div>
                </FadeIn>
            </section>

            <section className="py-20 md:py-28 bg-stone-50">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <FadeIn direction="right">
                        <div className="relative h-[420px] bg-white" data-sanity={wine.cliquerImage}>
                            <Image
                                src={wine.image || "/images/bouteilles/brouilly.jpg"}
                                alt={`${wine.name} - Domaine de Garanches`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain p-8 mix-blend-multiply"
                            />
                        </div>
                    </FadeIn>
                    <FadeIn direction="left" delay={0.2}>
                        {wine.description && (
                            <p className="text-gray-800 leading-relaxed text-base md:text-lg mb-8">{wine.description}</p>
                        )}
                        <dl className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                { label: "Millésime", value: wine.millesime },
                                { label: "Volume", value: wine.volume },
                                { label: "Alcool", value: wine.alcohol },
                                { label: "À table", value: wine.tags?.join(" • ") },
                                { label: "Mentions", value: wine.allergens },
                            ].filter((d) => d.value).map((d) => (
                                <div key={d.label} className="bg-white border border-stone-200 p-4">
                                    <dt className="text-red-900 text-sm font-bold mb-1">{d.label}</dt>
                                    <dd className="text-gray-700 text-sm">{d.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="text-2xl font-bold text-red-900 mb-6">
                            {prixAffiche(wine)}
                        </p>
                        <RequestBottlesButton wine={wine} />
                    </FadeIn>
                </div>
            </section>

            <Section title={texteDe(contenu, "cuvees.fiche.parcelle")} text={wine.parcelle} background="bg-white" />
            <Section title={texteDe(contenu, "cuvees.fiche.vinification")} text={wine.vinification} background="bg-stone-50" />

            {autres.length > 0 && (
                <section className="py-20 bg-stone-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl font-serif text-wine-900 text-center mb-12">{texteDe(contenu, "cuvees.fiche.autres")}</h2>
                        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
                            {autres.map((w: any) => (
                                <Link key={w.id} href={cuveeHref(w)} className="group sm:w-44 text-center">
                                    <div className="relative h-44 sm:h-48 bg-white mb-3">
                                        <Image src={w.image || "/images/bouteilles/brouilly.jpg"} alt={`Bouteille de ${nomComplet(w)}`} fill sizes="176px" className="object-contain p-3" />
                                    </div>
                                    <span className="font-serif text-base sm:text-lg text-wine-900 group-hover:text-red-900 transition-colors">{w.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <PageCards paths={["les-vins/a-table", "acheter"]} />
        </main>
    );
}

