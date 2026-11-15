import { LOCALE_OG, LANGUES, lienLangue, type Langue } from "@/lib/langue";
import { langueCourante } from "@/lib/langueServeur";

// Adresse publique du site, utilisée pour Google (adresses canoniques, plan du site, partages).
// Tant que domainedegaranches.com affiche encore l'ancien site, on reste sur l'adresse Vercel.
// Le jour où le domaine pointe vers ce site : remplacer SITE_URL_PAR_DEFAUT ici ET dans
// next.config.mjs par "https://domainedegaranches.com" (ou définir NEXT_PUBLIC_SITE_URL dans Vercel).
const SITE_URL_PAR_DEFAUT = "https://garanches.vercel.app";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_PAR_DEFAUT).replace(/\/+$/, "");
export const SITE_NAME = "Domaine de Garanches";
export const DEFAULT_OG_IMAGE = "/images/smugmug/partage-domaine.jpg";

// Adresse absolue à partir d'un chemin du site ("/les-vins" → "https://…/les-vins").
export function absolu(chemin: string) {
    if (/^https?:\/\//.test(chemin)) return chemin;
    return `${SITE_URL}${chemin.startsWith("/") ? "" : "/"}${chemin}`;
}

// Balises de partage (Facebook, WhatsApp, LinkedIn…) complètes pour une page.
// Next remplace tout le bloc openGraph du parent dès qu'une page en définit un :
// on redonne donc à chaque fois le nom du site, la langue et l'image.
// Le chemin est celui de la page française ("/contact") : il est mis dans la langue de la page.
export function partage({ chemin, titre, description, image, alt, type = "website", langue = langueCourante() }: {
    chemin: string; titre: string; description?: string; image?: string; alt?: string; type?: "website" | "article"; langue?: Langue;
}) {
    const img = image || DEFAULT_OG_IMAGE;
    return {
        openGraph: {
            title: titre,
            description,
            url: lienLangue(chemin, langue),
            siteName: SITE_NAME,
            locale: LOCALE_OG[langue],
            alternateLocale: LANGUES.filter((l) => l !== langue).map((l) => LOCALE_OG[l]),
            type,
            images: [{ url: img, alt: alt || titre }],
        },
        twitter: {
            card: "summary_large_image" as const,
            title: titre,
            description,
            images: [img],
        },
    };
}

// Fil d'Ariane pour Google (affiché sous le titre dans les résultats).
// Chemins français ("/les-vins") : ils sont mis dans la langue de la page.
export function filAriane(etapes: { nom: string; chemin: string }[], langue: Langue = langueCourante()) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ nom: langue === "en" ? "Home" : "Accueil", chemin: "/" }, ...etapes].map((e, i) => {
            const chemin = lienLangue(e.chemin, langue);
            return {
                "@type": "ListItem",
                position: i + 1,
                name: e.nom,
                item: absolu(chemin === "/" ? "" : chemin),
            };
        }),
    };
}

// Identifiant commun du domaine dans les données structurées, pour relier vins, pages et lieu.
export const WINERY_ID = `${SITE_URL}/#domaine`;
