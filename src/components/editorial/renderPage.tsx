import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorialPage from "./EditorialPage";
import Team from "./Team";
import WinesList from "@/components/WinesList";
import { PAGES } from "@/data/architecture";
import { SEO } from "@/data/seo";
import { cuveeHref } from "@/lib/wineSlug";
import { getBlocs } from "@/sanity/lib/queries";
import { getContenuSite } from "@/sanity/lib/contenu";
import { stegaClean } from "next-sanity";
import { getWines } from "@/lib/wines";
import { SITE_NAME, WINERY_ID, absolu, filAriane, partage } from "@/lib/site";
import { altPhoto } from "@/data/alts";

// Titre et description pour Google : ceux saisis dans le studio (Pages › Google), sinon ceux de src/data/seo.ts.
export async function pageMetadata(path: string): Promise<Metadata> {
    const page = PAGES[path];
    if (!page) return {};
    const infos = (await getContenuSite()).pages[path];
    const label = stegaClean(infos?.titre) ?? page.label;
    const seo = SEO[path] ?? { title: label, description: page.description };
    const title = stegaClean(infos?.seoTitre) || seo.title;
    const description = stegaClean(infos?.seoDescription) || seo.description;
    const image = infos?.photo?.src ?? page.image;
    return {
        title,
        description,
        alternates: { canonical: `/${path}` },
        ...partage({
            chemin: `/${path}`,
            titre: `${label} | ${SITE_NAME}`,
            description,
            image,
            alt: altPhoto(page.image, label),
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
                        availability: wine.enVente === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                        url: absolu(cuveeHref(wine)),
                        seller: { "@id": WINERY_ID },
                    },
                }),
            },
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialiserJsonLd(jsonLd) }} />
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

    const [overrides, contenu] = await Promise.all([getBlocs(), getContenuSite()]);
    const Extra = EXTRAS[path];
    // Fil d'Ariane pour Google : Accueil › Le Lieu › L'histoire.
    const parent = path.includes("/") ? PAGES[path.split("/")[0]] : undefined;
    const ariane = filAriane([
        ...(parent ? [{ nom: stegaClean(contenu.pages[parent.path]?.titre) ?? parent.label, chemin: `/${parent.path}` }] : []),
        { nom: stegaClean(contenu.pages[path]?.titre) ?? page.label, chemin: `/${path}` },
    ]);

    return (
        <EditorialPage page={page} overrides={overrides}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialiserJsonLd(ariane) }} />
            {Extra && <Extra />}
        </EditorialPage>
    );
}
