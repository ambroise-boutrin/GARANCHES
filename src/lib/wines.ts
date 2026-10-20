import { wineSlug } from "@/lib/wineSlug";
import { PRODUCTS } from "@/data/products";
import { getSumUpProducts } from "@/lib/sumup";
import { getWines as getSanityWines } from "@/sanity/lib/queries";

// Catalogue : Sanity d'abord, puis SumUp, puis la liste statique.
export async function getWines() {
    try {
        const sanityWines = await getSanityWines();
        if (sanityWines && sanityWines.length > 0) {
            return sanityWines;
        }
    } catch (error) {
        console.error("Sanity: vins indisponibles", error);
    }

    const wines = await getSumUpProducts();
    if (wines && wines.length > 0) {
        return wines;
    }
    return PRODUCTS;
}

export async function getWine(slug: string) {
    const wines = await getWines();
    return { wine: wines.find((w: any) => wineSlug(w) === slug), wines };
}
