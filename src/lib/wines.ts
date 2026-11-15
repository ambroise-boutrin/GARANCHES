import { wineSlug } from "@/lib/wineSlug";
import { PRODUCTS } from "@/data/products";
import { getWines as getSanityWines } from "@/sanity/lib/queries";

// Catalogue : les vins du studio Sanity, sinon la liste statique (avant le premier import, ou si Sanity ne répond pas).
// Aucun prix ne doit apparaître sur le site, même dans le code des pages : le prix, le stock et la mention
// des sulfites restent dans le studio (pour la future boutique) mais ne sont jamais envoyés aux pages.
function sansPrix({ price, prix, stock, allergens, ...vin }: any): any {
    return vin;
}

export async function getWines() {
    try {
        const sanityWines = await getSanityWines();
        if (sanityWines && sanityWines.length > 0) {
            return sanityWines.map(sansPrix);
        }
    } catch (error) {
        console.error("Sanity: vins indisponibles", error);
    }

    return PRODUCTS.map(sansPrix);
}

export async function getWine(slug: string) {
    const wines = await getWines();
    return { wine: wines.find((w: any) => wineSlug(w) === slug) ?? wines.find((w: any) => w.id === slug), wines };
}
