import { wineSlug } from "@/lib/wineSlug";
import { PRODUCTS } from "@/data/products";
import { getWines as getSanityWines } from "@/sanity/lib/queries";
import { langueCourante } from "@/lib/langueServeur";
import type { Langue } from "@/lib/langue";
import { MOTS_VINS_EN, SOUS_TITRES_EN, VINS_EN } from "@/i18n/en/divers";
import { stegaClean } from "next-sanity";

// Catalogue : les vins du studio Sanity, sinon la liste statique (avant le premier import, ou si Sanity ne répond pas).
// Aucun prix ne doit apparaître sur le site, même dans le code des pages : le prix, le stock et la mention
// des sulfites restent dans le studio (pour la future boutique) mais ne sont jamais envoyés aux pages.
function sansPrix({ price, prix, stock, allergens, ...vin }: any): any {
    return vin;
}

// Version anglaise d'un vin : champs « en anglais » du studio, sinon la traduction du code (src/i18n/en/divers.ts).
// Le nom et le millésime ne se traduisent pas.
const motEn = (mot: string) => MOTS_VINS_EN[stegaClean(mot).trim().toLowerCase()] ?? mot;
const sousTitreEn = (texte: string) =>
    String(texte || "").split(/(\s+[—–-]\s+)/).map((m) => SOUS_TITRES_EN[stegaClean(m).trim().toLowerCase()] ?? m).join("");

function enAnglais({ subtitleEn, descriptionEn, tagsEn, parcelleEn, vinificationEn, ...vin }: any): any {
    const code = VINS_EN[wineSlug(vin)] ?? {};
    return {
        ...vin,
        subtitle: subtitleEn || code.subtitle || sousTitreEn(vin.subtitle),
        description: descriptionEn || code.description || vin.description,
        // Sections détaillées : masquées en anglais tant qu'elles ne sont pas traduites.
        parcelle: parcelleEn || code.parcelle || undefined,
        vinification: vinificationEn || code.vinification || undefined,
        tags: tagsEn?.length ? tagsEn : vin.tags?.map(motEn),
    };
}

// En français, on retire les champs anglais.
function enFrancais({ subtitleEn, descriptionEn, tagsEn, parcelleEn, vinificationEn, ...vin }: any): any {
    return vin;
}

// La langue de la page en cours, ou celle demandée (fichiers sans page, comme /llms.txt).
function dansLaLangue(vins: any[], langue: Langue = langueCourante()) {
    return vins.map(langue === "en" ? enAnglais : enFrancais);
}

export async function getWines(langue?: Langue) {
    try {
        const sanityWines = await getSanityWines();
        if (sanityWines && sanityWines.length > 0) {
            return dansLaLangue(sanityWines.map(sansPrix), langue);
        }
    } catch (error) {
        console.error("Sanity: vins indisponibles", error);
    }

    return dansLaLangue(PRODUCTS.map(sansPrix), langue);
}

// Un vin et tous ses millésimes : une seule bouteille montrée, puis chaque millésime décliné.
// Les millésimes d'un même vin portent le même nom dans le studio (« Brouilly »).
// L'adresse du vin est celle de la fiche sans année (« brouilly ») ; « brouilly-2024 » renvoie vers « brouilly#2024 ».
export type Gamme = { id: string; slug: string; name: string; subtitle?: string; image?: string; cliquerImage?: string; tags?: string[]; volume?: string; millesimes: any[] };

const sansAnnee = (slug: string) => slug.replace(/-\d{4}$/, "");

export async function getGammes(langue?: Langue): Promise<Gamme[]> {
    const wines = await getWines(langue);
    const parNom = new Map<string, any[]>();
    for (const w of wines) {
        const cle = String(w.name).trim().toLowerCase();
        parNom.set(cle, [...(parNom.get(cle) ?? []), w]);
    }
    return [...parNom.values()].map((vins) => {
        const principal = vins.find((w) => sansAnnee(wineSlug(w)) === wineSlug(w)) ?? vins[0];
        const avecPhoto = principal.image ? principal : vins.find((w) => w.image) ?? principal;
        const millesimes = [...vins].sort((a, b) => String(a.millesime ?? "").localeCompare(String(b.millesime ?? "")));
        return {
            id: principal.id,
            slug: sansAnnee(wineSlug(principal)),
            name: principal.name,
            subtitle: principal.subtitle,
            image: avecPhoto.image,
            cliquerImage: avecPhoto.cliquerImage,
            tags: vins.find((w) => w.tags?.length)?.tags,
            volume: vins.find((w) => w.volume)?.volume,
            millesimes,
        };
    });
}

// Le vin demandé, ou l'adresse où renvoyer une ancienne fiche de millésime.
export async function getGamme(slug: string): Promise<{ gamme?: Gamme; gammes: Gamme[]; redirection?: string }> {
    const gammes = await getGammes();
    const gamme = gammes.find((g) => g.slug === slug);
    if (gamme) return { gamme, gammes };
    for (const g of gammes) {
        const vin = g.millesimes.find((w) => wineSlug(w) === slug || w.id === slug);
        if (vin) return { gammes, redirection: `/les-vins/cuvees/${g.slug}${vin.millesime ? `#${vin.millesime}` : ""}` };
    }
    return { gammes };
}
