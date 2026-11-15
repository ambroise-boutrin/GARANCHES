import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorialPage from "./EditorialPage";
import Team from "./Team";
import WinesList from "@/components/WinesList";
import { pagesDe } from "@/data/architecture";
import { SEO } from "@/data/seo";
import { SEO_EN } from "@/i18n/en/seo";
import { ALTS_EN } from "@/i18n/en/divers";
import { UI } from "@/i18n/ui";
import { CODE_LANGUE, alternatives, lienLangue } from "@/lib/langue";
import { langueCourante } from "@/lib/langueServeur";
import { cuveeHref } from "@/lib/wineSlug";
import { getBlocs } from "@/sanity/lib/queries";
import { getContenuSite } from "@/sanity/lib/contenu";
import { stegaClean } from "next-sanity";
import { getGammes } from "@/lib/wines";
import { SITE_NAME, WINERY_ID, absolu, filAriane, partage } from "@/lib/site";
import { altPhoto } from "@/data/alts";

// Titre et description pour Google : ceux saisis dans le studio (Pages › Google), sinon ceux de src/data/seo.ts.
export async function pageMetadata(path: string): Promise<Metadata> {
    const langue = langueCourante();
    const page = pagesDe(langue)[path];
    if (!page) return {};
    const infos = (await getContenuSite()).pages[path];
    const label = stegaClean(infos?.titre) ?? page.label;
    const seo = (langue === "en" ? SEO_EN : SEO)[path] ?? { title: label, description: page.description };
    const title = stegaClean(infos?.seoTitre) || seo.title;
    const description = stegaClean(infos?.seoDescription) || seo.description;
    const image = infos?.photo?.src ?? page.image;
    return {
        title,
        description,
        alternates: alternatives(`/${path}`, langue),
        ...partage({
            chemin: `/${path}`,
            titre: `${label} | ${SITE_NAME}`,
            description,
            image,
            alt: langue === "en" ? ALTS_EN[page.image] ?? label : altPhoto(page.image, label),
        }),
    };
}

async function Cuvees() {
    const wines = await getGammes();
    const langue = langueCourante();
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        inLanguage: CODE_LANGUE[langue],
        itemListElement: wines.map((wine, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Product",
                name: wine.name,
                url: absolu(lienLangue(cuveeHref(wine), langue)),
                description: String(wine.millesimes[0]?.description || "").split(/\n\s*\n/)[0],
                image: absolu(wine.image || "/images/bouteilles/brouilly.jpg"),
                brand: { "@type": "Brand", name: SITE_NAME },
                manufacturer: { "@id": WINERY_ID },
                category: UI[langue].categorieVin,
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
    const langue = langueCourante();
    const PAGES = pagesDe(langue);
    const page = PAGES[path];
    if (!page) notFound();

    const [overrides, contenu] = await Promise.all([getBlocs(langue), getContenuSite()]);
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
