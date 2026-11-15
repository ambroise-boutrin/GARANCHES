import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/Lien";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { getCarnet } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SITE_NAME, WINERY_ID, absolu, filAriane, partage } from "@/lib/site";
import { formatDate, themeLabel } from "@/lib/carnets";
import { CODE_LANGUE, alternatives, lienLangue } from "@/lib/langue";
import { definirLangue } from "@/lib/langueServeur";
import { UI } from "@/i18n/ui";
import PageCards from "@/components/editorial/PageCards";

export const revalidate = 60;

type Props = { params: { lang: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const langue = definirLangue(params.lang);
    const carnet = await getCarnet(params.slug);
    if (!carnet) return {};
    return {
        title: carnet.titre,
        description: carnet.extrait,
        alternates: alternatives(`/carnets/${params.slug}`, langue),
        ...partage({
            chemin: `/carnets/${params.slug}`,
            titre: `${carnet.titre} | ${SITE_NAME}`,
            description: carnet.extrait,
            image: carnet.image?.asset ? urlFor(carnet.image).width(1200).height(630).url() : undefined,
            type: "article",
        }),
    };
}

const components: PortableTextComponents = {
    types: {
        image: ({ value }) =>
            value?.asset ? (
                <figure className="my-10">
                    <Image
                        src={urlFor(value).width(1400).url()}
                        alt={value.legende || ""}
                        width={1400}
                        height={900}
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="w-full h-auto"
                    />
                    {value.legende && <figcaption className="text-sm text-gray-700 mt-2 text-center">{value.legende}</figcaption>}
                </figure>
            ) : null,
    },
};

export default async function CarnetPage({ params }: Props) {
    const langue = definirLangue(params.lang);
    const ui = UI[langue];
    const carnet = await getCarnet(params.slug);
    if (!carnet) notFound();

    return (
        <main className="min-h-screen bg-paper pt-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serialiserJsonLd([
                        {
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            headline: carnet.titre,
                            description: carnet.extrait,
                            // Les Carnets sont écrits en français, même sur la version anglaise.
                            inLanguage: CODE_LANGUE.fr,
                            url: absolu(lienLangue(`/carnets/${params.slug}`, langue)),
                            mainEntityOfPage: absolu(lienLangue(`/carnets/${params.slug}`, langue)),
                            ...(carnet.date && { datePublished: carnet.date }),
                            ...(carnet.image?.asset && { image: urlFor(carnet.image).width(1200).url() }),
                            author: { "@id": WINERY_ID },
                            publisher: { "@id": WINERY_ID },
                        },
                        filAriane([
                            { nom: ui.carnetsTitre, chemin: "/carnets" },
                            { nom: carnet.titre, chemin: `/carnets/${params.slug}` },
                        ]),
                    ]),
                }}
            />
            <article className="max-w-3xl mx-auto px-6">
                <Link href="/carnets" className="text-red-900 text-base underline underline-offset-4 decoration-1 hover:text-wine-900 transition-colors">
                    {ui.carnetsTitre}
                </Link>
                <p className="text-sm text-gray-700 font-bold mt-8 mb-3">
                    {[themeLabel(carnet.theme, langue), formatDate(carnet.date, langue)].filter(Boolean).join(" · ")}
                </p>
                <h1 lang="fr" className="text-4xl md:text-5xl font-serif text-wine-900 mb-10 leading-tight">{carnet.titre}</h1>
                {ui.carnetsEnFrancais && <p className="-mt-6 mb-10 text-sm text-gray-700">{ui.carnetsEnFrancais}</p>}
                {carnet.image?.asset && (
                    <div className="relative h-[420px] overflow-hidden mb-12">
                        <Image src={urlFor(carnet.image).width(1600).url()} alt={carnet.image?.legende || carnet.titre} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                    </div>
                )}
                <div lang="fr" className="text-gray-700 leading-relaxed text-lg space-y-5">
                    {carnet.contenu && <PortableText value={carnet.contenu} components={components} />}
                </div>
            </article>

            {/* Un Carnet renvoie vers les autres univers. */}
            <div className="bg-stone-100 mt-20">
                <PageCards paths={["le-lieu", "les-vins", "rencontrons-garanches"]} />
            </div>
        </main>
    );
}
