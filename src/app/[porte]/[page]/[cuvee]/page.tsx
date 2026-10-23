import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import RequestBottlesButton from "@/components/RequestBottlesButton";
import RichText from "@/components/editorial/RichText";
import PageCards from "@/components/editorial/PageCards";
import { getWine } from "@/lib/wines";
import { cuveeHref } from "@/lib/wineSlug";

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
    const title = wine.subtitle ? `${wine.name} – ${wine.subtitle}` : wine.name;
    return {
        title,
        description: resume(`${wine.name} du domaine de Garanches, à Odenas au pied du Mont Brouilly. ${wine.description || ""}`),
        alternates: { canonical: cuveeHref(wine) },
        openGraph: { title: `${wine.name} | Domaine de Garanches`, images: [image(wine)], url: cuveeHref(wine) },
    };
}

const SITE = "https://domainedegaranches.com";

// Description pour Google : coupée proprement vers 155 caractères.
function resume(texte: string) {
    const propre = texte.replace(/\s+/g, " ").trim();
    if (propre.length <= 155) return propre;
    return propre.slice(0, 154).replace(/\s+\S*$/, "") + "…";
}

function image(wine: any): string {
    const src = wine.image || "/images/36_brouilly-h.jpg";
    return src.startsWith("http") ? src : `${SITE}${src}`;
}

function Section({ title, text, background }: { title: string; text?: string; background: string }) {
    return (
        <section className={`py-16 md:py-24 ${background}`}>
            <FadeIn className="max-w-3xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-serif text-red-900 mb-6">{title}</h2>
                {text ? (
                    <RichText text={text} className="text-gray-600 leading-loose text-base md:text-lg font-light" />
                ) : (
                    <p className="text-gray-400 italic font-light">Texte à venir.</p>
                )}
            </FadeIn>
        </section>
    );
}

export default async function CuveePage({ params }: Props) {
    const data = await load(params);
    if (!data?.wine) notFound();
    const { wine, wines } = data;
    const autres = wines.filter((w: any) => w.id !== wine.id);

    return (
        <main className="min-h-screen text-gray-800 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: wine.name,
                        description: wine.description,
                        image: image(wine),
                        url: `${SITE}${cuveeHref(wine)}`,
                        brand: { "@type": "Brand", name: "Domaine de Garanches" },
                        offers: {
                            "@type": "Offer",
                            priceCurrency: "EUR",
                            price: (wine.price / 100).toFixed(2),
                            availability: "https://schema.org/InStock",
                            url: `${SITE}${cuveeHref(wine)}`,
                        },
                    }),
                }}
            />
            <section className="relative h-[60vh] min-h-[420px] flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src="/images/23_slide002.jpg" alt="" fill sizes="100vw" priority quality={75} className="object-cover brightness-[.6]" />
                </div>
                <FadeIn direction="down" className="relative text-center px-4 pt-20 flex flex-col items-center">
                    <Link href="/les-vins/cuvees" className="uppercase tracking-[0.3em] text-[10px] md:text-sm text-white font-bold hover:text-white transition-colors">
                        Les cuvées
                    </Link>
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-tight text-white mt-4 mb-4">{wine.name}</h1>
                    {wine.subtitle && <p className="text-white/80 uppercase tracking-widest text-xs mb-6">{wine.subtitle}</p>}
                    <div className="w-16 h-0.5 md:w-24 md:h-1 bg-white"></div>
                </FadeIn>
            </section>

            <section className="py-20 md:py-28 bg-stone-50">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <FadeIn direction="right">
                        <div className="relative h-[420px] bg-white rounded-lg shadow-xl">
                            <Image
                                src={wine.image || "/images/36_brouilly-h.jpg"}
                                alt={`${wine.name} - Domaine de Garanches`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain p-8 mix-blend-multiply"
                            />
                        </div>
                    </FadeIn>
                    <FadeIn direction="left" delay={0.2}>
                        {wine.description && (
                            <p className="text-gray-600 leading-loose text-base md:text-lg font-light mb-8">{wine.description}</p>
                        )}
                        <dl className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                { label: "Volume", value: wine.volume },
                                { label: "Alcool", value: wine.alcohol },
                                { label: "À table", value: wine.tags?.join(" • ") },
                                { label: "Mentions", value: wine.allergens },
                            ].filter((d) => d.value).map((d) => (
                                <div key={d.label} className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
                                    <dt className="text-red-900 uppercase tracking-widest text-[10px] font-bold mb-1">{d.label}</dt>
                                    <dd className="text-gray-700 text-sm">{d.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="text-2xl font-bold text-red-900 mb-6">
                            {(wine.price / 100).toFixed(2).replace(".", ",")} €
                        </p>
                        <RequestBottlesButton wine={wine} />
                    </FadeIn>
                </div>
            </section>

            <Section title="Parcelle et terroir" text={wine.parcelle} background="bg-white" />
            <Section title="Assemblage et élevage" text={wine.vinification} background="bg-stone-50" />

            {autres.length > 0 && (
                <section className="py-20 bg-stone-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl font-serif text-wine-900 text-center mb-12">Les autres cuvées</h2>
                        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
                            {autres.map((w: any) => (
                                <Link key={w.id} href={cuveeHref(w)} className="group sm:w-44 text-center">
                                    <div className="relative h-28 sm:h-40 bg-white rounded-lg shadow-sm mb-3">
                                        <Image src={w.image || "/images/36_brouilly-h.jpg"} alt="" fill sizes="176px" className="object-contain p-3" />
                                    </div>
                                    <span className="font-serif text-base sm:text-lg uppercase tracking-[0.04em] text-wine-900 group-hover:text-red-900 transition-colors">{w.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <PageCards paths={["les-vins/a-table", "acheter"]} title="Poursuivre" />
        </main>
    );
}

