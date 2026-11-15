import { CARNETS_INTRO_EN, HOME_PORTES_EN, SIGNATURE_EN } from "./architecture";

// Version anglaise des petits textes de src/data/textes.ts (mêmes clés).
// Dans le studio (Accueil, contact, pied de page…), le champ « Texte en anglais » remplace celui d'ici.

const portes: Record<string, string> = Object.fromEntries(
    Object.entries(HOME_PORTES_EN).flatMap(([path, entrees]) =>
        entrees.flatMap((e, i) => [
            [`accueil.porte.${path}.${i + 1}.titre`, e.label],
            [`accueil.porte.${path}.${i + 1}.mots`, e.motsCles],
        ])
    )
);

export const TEXTES_EN: Record<string, string> = {
    // Home
    "accueil.titre": "Domaine de\nGaranches",
    "accueil.lieu": "Odenas — Mont Brouilly",
    "accueil.phrase": "In Odenas, at the foot of Mont Brouilly, Garanches is a place shaped by time, by granite and by the generations who brought it to life.",
    "accueil.bouton-vins": "Discover the wines",
    "accueil.bouton-rencontre": "Come and meet us",
    "accueil.signature": SIGNATURE_EN,
    ...portes,
    "accueil.histoire.titre": "A story\nthat goes on.",
    "accueil.histoire.texte": `Garanches carries a story that goes far beyond that of a single property. Men and women worked here, thought, passed things on and sometimes had to invent so that the vines could carry on.

Here the granite ranges from blue to pink, and generations of vines grow side by side: some are nearly 150 years old, others only a few years. We watch them live through the seasons, with what they carry from the past and what they promise for tomorrow.`,
    "accueil.histoire.lien": "Read the history",
    "accueil.lieu-vins.titre": "Wines that come from a place.",
    "accueil.lieu-vins.1.titre": "Gamay",
    "accueil.lieu-vins.1.texte": "The grape of the Beaujolais. On our Mont Brouilly granite, it gives Brouilly wines with red and black fruit, straight and mineral.",
    "accueil.lieu-vins.2.titre": "Chardonnay",
    "accueil.lieu-vins.2.texte": "On a few hand-picked clay and limestone plots, it gives a floral Bourgogne blanc, with notes of citrus and white flowers.",
    "accueil.lieu-vins.3.titre": "Our approach",
    "accueil.lieu-vins.3.texte": "Independent winegrowers, HVE certified (High Environmental Value). Grassed rows, worked soils, hand harvesting: we follow the vine through the seasons.",
    "accueil.vins.titre": "Our wines",
    "accueil.vins.texte": "Precise, lively wines, made in small quantities. They are shipped straight from our cellar in Odenas, anywhere in France.",
    "accueil.vins.bouton": "See all the cuvées",

    // Wines
    "cuvees.bouton": "Request bottles",
    "cuvees.epuise": "Sold out",
    "cuvees.decouvrir": "Discover the cuvée",
    "cuvees.question.titre": "A question about a vintage?",
    "cuvees.question.texte": "Feel free to contact us to find out about shipping costs or to place an order directly.",
    "cuvees.question.lien": "Contact us",
    "cuvees.fiche.parcelle": "Plot and terroir",
    "cuvees.fiche.vinification": "Blending and ageing",
    "cuvees.fiche.autres": "Our other cuvées",

    // Contact
    "contact.titre": "Contact",
    "contact.intro": "Visit, write, call, book: we are here for you.",
    "contact.coordonnees": "How to reach us",
    "contact.adresse": "Domaine de Garanches\n345 chemin de Garanches\n69460 Odenas\nFrance",
    "contact.horaires": "Monday to Saturday: 9 am – 6 pm",
    "contact.fermeture": "Closed on Sundays and French public holidays",
    "contact.formulaire": "Send us a message",
    "contact.delai": "We reply within 24 hours. For an immediate answer, give us a call.",
    "contact.aller-formulaire": "Write a message",
    "contact.venir.titre": "Getting to Garanches",
    "contact.venir.texte": "345 chemin de Garanches, 69460 Odenas, France, at the foot of Mont Brouilly.",
    "contact.faq.titre": "Frequently asked questions",

    // Notebooks
    "carnets.intro.titre": CARNETS_INTRO_EN.title,
    "carnets.intro.texte": CARNETS_INTRO_EN.body,

    // Common
    "pages.poursuivre": "Continue",
    "pages.decouvrir": "Discover",
    "pages.a-venir": "Text coming soon.",

    // Footer
    "pied.nom": "Domaine de Garanches",
    "pied.adresse": "345 chemin de Garanches\n69460 Odenas, France",
    "pied.contact": "Contact us",
    "pied.mention": "Domaine de Garanches. Alcohol abuse is dangerous for your health; please drink responsibly.",
    "menu.commander": "Order",
};
