// Description des grandes photos d'ouverture des pages, lue par Google Images et les lecteurs d'écran.
const G = "/images/garanches/";
const S = "/images/smugmug/";

const ALTS: Record<string, string> = {
    [`${G}maison-domaine.jpg`]: "La maison du domaine de Garanches et son parc, à Odenas",
    [`${G}mont-brouilly-vignes.jpg`]: "Le Mont Brouilly et ses coteaux de vignes, dans le Beaujolais",
    [`${G}maison-facade.jpg`]: "La façade de la maison de Garanches aux volets jaunes",
    [`${G}registre-cave.jpg`]: "Un ancien registre manuscrit, « État de la cave de Garanches »",
    [`${G}michel-stagnara.jpg`]: "Michel Stagnara, au domaine de Garanches",
    [`${G}vendanges-raisins.jpg`]: "Raisins de Gamay versés dans la cuve pendant les vendanges à Garanches",
    [`${G}raisins-vendange.jpg`]: "Grappes de Gamay tout juste vendangées au domaine de Garanches",
    [`${S}table-fromages.jpg`]: "Plateau de fromages servi avec les vins de Garanches",
    [`${G}maison-jardin.jpg`]: "Une maison du domaine de Garanches et sa tonnelle de vigne",
    [`${S}table-hotes.jpg`]: "Repas partagé à la table d'hôtes du domaine de Garanches",
    [`${S}cave-foudres.jpg`]: "Visite de la cave de Garanches et de ses grands foudres de chêne",
    [`${G}vignes-cadole.jpg`]: "Les vignes de Garanches et une cadole, avec la plaine du Beaujolais au loin",
    [`${S}salle-reception.jpg`]: "La salle de dégustation du domaine de Garanches",
    [`${G}feuilles-automne.jpg`]: "Feuilles de vigne à l'automne au domaine de Garanches",
    [`${S}portail-garanches.jpg`]: "Le portail du domaine, marqué Garanches",
};

export function altPhoto(src: string, repli = "") {
    return ALTS[src] ?? repli;
}
