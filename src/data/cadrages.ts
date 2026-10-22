// Point de la photo à garder visible quand le cadre la recadre (visages, sujet).
// Valeur CSS object-position : horizontal puis vertical, en pourcentage.
const G = "/images/garanches/";

const CADRAGES: Record<string, string> = {
    [`${G}accueil-cave.jpg`]: "30% 20%",
    [`${G}accueil-terrasse.jpg`]: "55% 20%",
    [`${G}loquet-porte.jpg`]: "40% 35%",
    [`${G}maison-domaine.jpg`]: "55% 55%",
    [`${G}maison-granit.jpg`]: "50% 40%",
    [`${G}terrasse-domaine.jpg`]: "40% 20%",
    [`${G}terrasse-vignes.jpg`]: "45% 20%",
    [`${G}vue-mont-brouilly.jpg`]: "50% 15%",
    [`${G}domaine-vignes.jpg`]: "40% 30%",
    [`${G}michel-stagnara.jpg`]: "45% 10%",
    [`${G}michel-portrait.jpg`]: "50% 30%",
    [`${G}tancrede-stagnara.jpg`]: "50% 30%",
    [`${G}ambroise-verre.jpg`]: "50% 30%",
    [`${G}isabelle-terrasse.jpg`]: "45% 20%",
    "/images/3_image.jpg": "50% 25%",
    "/images/36_brouilly-h.jpg": "25% 50%",
    "/images/10_slide003.jpg": "40% 50%",
};

export function cadrage(src?: string): string | undefined {
    return src ? CADRAGES[src] : undefined;
}
