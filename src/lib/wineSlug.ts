// Adresse de la page d'une cuvée : le slug Sanity s'il existe, sinon l'identifiant du vin.
export function wineSlug(wine: { slug?: string; id: string }) {
    return wine.slug || wine.id;
}

export function cuveeHref(wine: { slug?: string; id: string }) {
    return `/les-vins/cuvees/${wineSlug(wine)}`;
}
