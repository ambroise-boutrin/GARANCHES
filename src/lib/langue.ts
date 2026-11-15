// Le site existe en français (adresses sans préfixe) et en anglais (adresses en /en).
// Les adresses anglaises gardent les mêmes chemins que le français : /en/le-lieu/histoire.
export const LANGUES = ["fr", "en"] as const;
export type Langue = (typeof LANGUES)[number];

export const estLangue = (valeur: unknown): valeur is Langue => LANGUES.includes(valeur as Langue);

// Cookie posé quand le visiteur choisit sa langue avec le bouton FR / EN (lu par src/middleware.ts).
export const COOKIE_LANGUE = "langue";

// Codes pour Google et les partages.
export const CODE_LANGUE: Record<Langue, string> = { fr: "fr-FR", en: "en-GB" };
export const LOCALE_OG: Record<Langue, string> = { fr: "fr_FR", en: "en_GB" };

// Adresse d'une page dans une langue : "/contact" → "/en/contact", "/" → "/en".
// Les liens externes, les ancres seules, les fichiers et les adresses déjà préfixées ne changent pas.
export function lienLangue(href: string, langue: Langue): string {
    if (langue === "fr" || !href.startsWith("/") || href.startsWith("//")) return href;
    if (/^\/(en)(?=$|[/?#])/.test(href)) return href;
    if (/^\/(api|studio|images|videos|_next)(\/|$)/.test(href)) return href;
    if (href === "/") return "/en";
    if (/^\/[?#]/.test(href)) return `/en${href.slice(1)}`;
    return `/en${href}`;
}

// Chemin sans la langue : "/en/contact" → "/contact", "/en" → "/".
export function sansLangue(chemin: string): string {
    const m = chemin.match(/^\/(en|fr)(?=$|[/?#])(.*)$/);
    if (!m) return chemin || "/";
    return m[2] ? (m[2].startsWith("/") ? m[2] : `/${m[2]}`) : "/";
}

// Adresses de la page dans chaque langue, pour Google (balises hreflang et adresse canonique).
export function alternatives(chemin: string, langue: Langue) {
    const fr = chemin || "/";
    const en = lienLangue(fr, "en");
    return {
        canonical: langue === "en" ? en : fr,
        languages: { "fr-FR": fr, "en-GB": en, "x-default": fr },
    };
}
