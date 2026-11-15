import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_LANGUE } from "@/lib/langue";

// Français par défaut, anglais pour les visiteurs dont le téléphone ou l'ordinateur n'est pas en français
// (choix d'Ambroise, 15/11/2026). On se fie à la langue de l'appareil, pas au pays :
// un Anglais en vacances à Lyon a l'anglais, un Français à Londres garde le français.
// Le bouton FR / EN pose un cookie : ce choix l'emporte ensuite toujours.
//
// Les pages françaises gardent leurs adresses (/le-lieu) : elles sont servies en interne par /fr/le-lieu.
// Les pages anglaises sont en /en/le-lieu.

// Robots (Google, Bing, aperçus de liens…) : jamais redirigés, ils voient chaque adresse telle quelle.
const ROBOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|lighthouse|headless/i;

// Langue préférée de l'appareil : la première de la liste envoyée par le navigateur (la plus forte).
function prefereFrancais(entete: string | null): boolean {
    if (!entete) return true;
    const langues = entete
        .split(",")
        .map((morceau) => {
            const [code, ...params] = morceau.trim().split(";");
            const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
            return { code: code.trim().toLowerCase(), q: q ? Number(q.slice(2)) || 0 : 1 };
        })
        .filter((l) => l.code && l.code !== "*" && l.q > 0)
        .sort((a, b) => b.q - a.q);
    if (!langues.length) return true;
    return langues[0].code.startsWith("fr");
}

export function middleware(requete: NextRequest) {
    const url = requete.nextUrl;
    const chemin = url.pathname;

    // /fr/… n'est pas une adresse publique : on renvoie vers l'adresse sans préfixe.
    if (chemin === "/fr" || chemin.startsWith("/fr/")) {
        const cible = url.clone();
        cible.pathname = chemin.slice(3) || "/";
        return NextResponse.redirect(cible, 308);
    }

    // Pages anglaises : servies telles quelles.
    if (chemin === "/en" || chemin.startsWith("/en/")) return NextResponse.next();

    const choix = requete.cookies.get(COOKIE_LANGUE)?.value;
    const robot = ROBOT.test(requete.headers.get("user-agent") || "");
    // Aperçu du studio Sanity : on reste sur la langue de l'adresse demandée.
    const apercu = requete.cookies.has("__prerender_bypass");
    if (choix === "en" || (!choix && !robot && !apercu && !prefereFrancais(requete.headers.get("accept-language")))) {
        const cible = url.clone();
        cible.pathname = chemin === "/" ? "/en" : `/en${chemin}`;
        // Redirection temporaire : l'adresse française reste la bonne pour Google.
        return NextResponse.redirect(cible, 307);
    }

    const interne = url.clone();
    interne.pathname = `/fr${chemin === "/" ? "" : chemin}`;
    return NextResponse.rewrite(interne);
}

export const config = {
    // Tout sauf les outils (studio, api), les fichiers du site et ceux de Next.
    matcher: ["/((?!api|studio|_next|_vercel|images|videos|favicon\\.ico|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|.*\\.[a-zA-Z0-9]+$).*)"],
};
