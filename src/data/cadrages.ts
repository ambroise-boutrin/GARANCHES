// Point de la photo à garder visible quand le cadre la recadre (visages, sujet).
// Valeur CSS object-position : horizontal puis vertical, en pourcentage.
const G = "/images/garanches/";

const CADRAGES: Record<string, string> = {
    [`${G}accueil-cave.jpg`]: "30% 20%",
    [`${G}accueil-terrasse.jpg`]: "55% 20%",
    [`${G}cave-foudres.jpg`]: "35% 20%",
    [`${G}degustation-foudre.jpg`]: "65% 35%",
    [`${G}degustation-verre.jpg`]: "60% 25%",
    [`${G}hotes-couple.jpg`]: "45% 20%",
    [`${G}loquet-porte.jpg`]: "40% 35%",
    [`${G}maison-domaine.jpg`]: "55% 55%",
    [`${G}maison-granit.jpg`]: "50% 40%",
    [`${G}memoire-cave.jpg`]: "40% 20%",
    [`${G}memoire-foudres.jpg`]: "35% 20%",
    [`${G}terrasse-domaine.jpg`]: "40% 20%",
    [`${G}terrasse-vignes.jpg`]: "45% 20%",
    [`${G}vendanges-chai.jpg`]: "55% 40%",
    [`${G}vendanges-geste.jpg`]: "60% 35%",
    [`${G}verre-rouge.jpg`]: "50% 25%",
    [`${G}vigneron-cave.jpg`]: "40% 20%",
    [`${G}vigneron-terrasse.jpg`]: "50% 20%",
    [`${G}vignerons-couple.jpg`]: "50% 25%",
    [`${G}vue-mont-brouilly.jpg`]: "50% 15%",
    [`${G}domaine-vignes.jpg`]: "40% 30%",
    "/images/3_image.jpg": "50% 25%",
    "/images/36_brouilly-h.jpg": "25% 50%",
    "/images/10_slide003.jpg": "40% 50%",
};

export function cadrage(src?: string): string | undefined {
    return src ? CADRAGES[src] : undefined;
}
