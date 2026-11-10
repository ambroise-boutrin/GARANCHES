// Point de la photo à garder visible quand le cadre la recadre (visages, sujet).
// Valeur CSS object-position : horizontal puis vertical, en pourcentage.
const G = "/images/garanches/";
const S = "/images/smugmug/";

const CADRAGES: Record<string, string> = {
    [`${G}accueil-cave.jpg`]: "30% 20%",
    [`${G}accueil-terrasse.jpg`]: "55% 20%",
    [`${G}loquet-porte.jpg`]: "40% 35%",
    [`${G}maison-domaine.jpg`]: "55% 55%",
    [`${G}maison-granit.jpg`]: "50% 40%",
    [`${G}terrasse-domaine.jpg`]: "40% 20%",
    [`${G}terrasse-vignes.jpg`]: "45% 20%",
    [`${G}michel-stagnara.jpg`]: "68% 15%",
    [`${G}michel-portrait.jpg`]: "50% 30%",
    [`${G}ambroise-verre.jpg`]: "50% 30%",
    [`${G}isabelle-terrasse.jpg`]: "45% 20%",
    [`${G}maison-facade.jpg`]: "50% 40%",
    [`${G}maison-parc-pierre.jpg`]: "58% 40%",
    [`${G}grappe-vigne.jpg`]: "55% 45%",
    [`${G}vignes-cadole.jpg`]: "25% 60%",
    [`${G}registre-cave.jpg`]: "50% 50%",
    "/images/3_image.jpg": "50% 25%",
    [`${S}cave-foudres.jpg`]: "55% 50%",
    [`${S}chai-pressoir.jpg`]: "40% 40%",
    [`${S}cour-visite.jpg`]: "50% 65%",
    [`${S}salle-reception.jpg`]: "55% 45%",
    [`${S}table-hotes.jpg`]: "50% 70%",
    [`${S}table-fromages.jpg`]: "50% 60%",
    [`${S}table-bouteilles.jpg`]: "50% 40%",
    [`${S}vignes-geste.jpg`]: "40% 45%",
    [`${S}aurelie-crozet.jpg`]: "50% 20%",
    [`${S}romain-martinache.jpg`]: "45% 15%",
};

export function cadrage(src?: string): string | undefined {
    return src ? CADRAGES[src] : undefined;
}
