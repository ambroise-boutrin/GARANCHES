import { stegaClean } from "@sanity/client/stega";
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

// Sous-titre « Cru du Beaujolais — Rouge — Lieu-dit Garanches » : la mention du lieu-dit est mise à part
// pour s'afficher sur sa propre ligne, sous le nom du vin, comme sur une étiquette.
export function separeLieuDit(subtitle?: string): { lieuDit?: string; reste?: string } {
    const morceaux = stegaClean(String(subtitle || "")).split(/\s+[—–-]\s+/).map((m) => m.trim()).filter(Boolean);
    const lieuDit = morceaux.find((m) => /^lieu-dit\b/i.test(m));
    const reste = morceaux.filter((m) => m !== lieuDit).join(" — ");
    return { lieuDit, reste: reste || undefined };
}
