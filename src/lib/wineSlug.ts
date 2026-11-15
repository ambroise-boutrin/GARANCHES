// Adresse de la page d'une cuvée : le slug Sanity s'il existe, sinon l'identifiant du vin.
export function wineSlug(wine: { slug?: string; id: string }) {
    return wine.slug || wine.id;
}

export function cuveeHref(wine: { slug?: string; id: string }) {
    return `/les-vins/cuvees/${wineSlug(wine)}`;
}

// Nom du vin suivi de son millésime, par exemple « Brouilly 2023 ».
export function nomMillesime(wine: { name: string; millesime?: string }) {
    return wine.millesime ? `${wine.name} ${wine.millesime}` : wine.name;
}
