import { wineSlug } from "@/lib/wineSlug";
import { PRODUCTS } from "@/data/products";
import { getWines as getSanityWines } from "@/sanity/lib/queries";

// Catalogue : Sanity d'abord, sinon la liste statique.
export async function getWines() {
    try {
        const sanityWines = await getSanityWines();
        if (sanityWines && sanityWines.length > 0) {
            return sanityWines;
        }
    } catch (error) {
        console.error("Sanity: vins indisponibles", error);
    }

    return PRODUCTS;
}

export async function getWine(slug: string) {
    const wines = await getWines();
    return { wine: wines.find((w: any) => wineSlug(w) === slug) ?? wines.find((w: any) => w.id === slug), wines };
}
