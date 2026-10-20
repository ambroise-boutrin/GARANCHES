import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorialPage from "./EditorialPage";
import Team from "./Team";
import WinesList from "@/components/WinesList";
import { PAGES } from "@/data/architecture";
import { getBlocs } from "@/sanity/lib/queries";
import { getWines } from "@/lib/wines";

const SITE = "https://domainedegaranches.com";

export function pageMetadata(path: string): Metadata {
    const page = PAGES[path];
    if (!page) return {};
    return {
        title: page.label,
        description: page.description,
        alternates: { canonical: `/${path}` },
        openGraph: { title: page.label, description: page.description, images: [page.image] },
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
                name: wine.name,
                description: wine.description,
                image: wine.image?.startsWith("http") ? wine.image : `${SITE}${wine.image || "/images/36_brouilly-h.jpg"}`,
                brand: { "@type": "Brand", name: "Domaine de Garanches" },
                offers: {
                    "@type": "Offer",
                    priceCurrency: "EUR",
                    price: (wine.price / 100).toFixed(2),
                    availability: "https://schema.org/InStock",
                    url: `${SITE}/les-vins/cuvees`,
                },
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

    return (
        <EditorialPage page={page} overrides={overrides}>
            {Extra && <Extra />}
        </EditorialPage>
    );
}
