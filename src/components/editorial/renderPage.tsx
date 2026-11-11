import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorialPage from "./EditorialPage";
import Team from "./Team";
import WinesList from "@/components/WinesList";
import { PAGES } from "@/data/architecture";
import { SEO } from "@/data/seo";
import { cuveeHref } from "@/lib/wineSlug";
import { getBlocs } from "@/sanity/lib/queries";
import { getWines } from "@/lib/wines";
import { SITE_NAME, WINERY_ID, absolu, filAriane, partage } from "@/lib/site";
import { altPhoto } from "@/data/alts";

export function pageMetadata(path: string): Metadata {
    const page = PAGES[path];
    if (!page) return {};
    const seo = SEO[path] ?? { title: page.label, description: page.description };
    return {
        title: seo.title,
        description: seo.description,
        alternates: { canonical: `/${path}` },
        ...partage({
            chemin: `/${path}`,
            titre: `${page.label} | ${SITE_NAME}`,
            description: seo.description,
            image: page.image,
            alt: altPhoto(page.image, page.label),
        }),
    };
}

async function Cuvees() {
    const wines = await getWines();
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        inLanguage: "fr-FR",
        itemListElement: wines.map((wine: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Product",
                name: wine.millesime ? `${wine.name} ${wine.millesime}` : wine.name,
                url: absolu(cuveeHref(wine)),
                description: wine.description,
                image: absolu(wine.image || "/images/bouteilles/brouilly.jpg"),
                brand: { "@type": "Brand", name: SITE_NAME },
                manufacturer: { "@id": WINERY_ID },
                category: "Vin",
                ...(typeof wine.price === "number" && {
                    offers: {
                        "@type": "Offer",
                        priceCurrency: "EUR",
                        price: (wine.price / 100).toFixed(2),
                        availability: "https://schema.org/InStock",
                        url: absolu(cuveeHref(wine)),
                        seller: { "@id": WINERY_ID },
                    },
                }),
            },
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <WinesList wines={wines} />
        </>
    );
}

// Contenu propre à certaines pages, affiché après leurs blocs de texte.
const EXTRAS: Record<string, () => JSX.Element | Promise<JSX.Element>> = {
    "les-vins/cuvees": Cuvees,
    "le-lieu/ceux-qui-le-font-vivre": Team,
};

export async function renderPage(path: string) {
    const page = PAGES[path];
    if (!page) notFound();

    const overrides = await getBlocs();
    const Extra = EXTRAS[path];
    // Fil d'Ariane pour Google : Accueil › Le Lieu › L'histoire.
    const parent = path.includes("/") ? PAGES[path.split("/")[0]] : undefined;
    const ariane = filAriane([
        ...(parent ? [{ nom: parent.label, chemin: `/${parent.path}` }] : []),
        { nom: page.label, chemin: `/${path}` },
    ]);

    return (
        <EditorialPage page={page} overrides={overrides}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ariane) }} />
            {Extra && <Extra />}
        </EditorialPage>
    );
}
