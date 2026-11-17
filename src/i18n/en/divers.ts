// Version anglaise des photos décrites (src/data/alts.ts), des questions fréquentes (src/data/faq.ts)
// et des vins (src/data/products.ts et studio › Vins).

const G = "/images/garanches/";
const S = "/images/smugmug/";

export const ALTS_EN: Record<string, string> = {
    [`${G}maison-domaine.jpg`]: "The house of the Garanches estate and its park, in Odenas",
    [`${G}mont-brouilly-vignes.jpg`]: "Mont Brouilly and its vine-covered slopes, in the Beaujolais",
    [`${G}maison-facade.jpg`]: "The front of the Garanches house with its yellow shutters",
    [`${G}registre-cave.jpg`]: "An old handwritten register, \"État de la cave de Garanches\"",
    [`${G}michel-stagnara.jpg`]: "Michel Stagnara at the Garanches estate",
    [`${G}vendanges-raisins.jpg`]: "Gamay grapes poured into the vat during the harvest at Garanches",
    [`${G}raisins-vendange.jpg`]: "Freshly harvested Gamay bunches at the Garanches estate",
    [`${S}table-fromages.jpg`]: "A cheese board served with the wines of Garanches",
    [`${G}maison-jardin.jpg`]: "One of the Garanches houses and its vine arbour",
    [`${S}table-hotes.jpg`]: "A meal shared at the Garanches estate's table",
    [`${S}cave-foudres.jpg`]: "A visit to the Garanches cellar and its large oak casks",
    [`${G}vignes-cadole.jpg`]: "The Garanches vineyard and a stone hut, with the Beaujolais plain in the distance",
    [`${S}salle-reception.jpg`]: "The tasting room of the Garanches estate",
    [`${G}feuilles-automne.jpg`]: "Vine leaves in autumn at the Garanches estate",
    [`${S}portail-garanches.jpg`]: "The estate gate, marked Garanches",
};

export const FAQS_EN = [
    {
        question: "Where is Domaine de Garanches?",
        answer: "Domaine de Garanches is at 345 chemin de Garanches in Odenas (69460, France), at the foot of Mont Brouilly, in the heart of the Beaujolais.",
    },
    {
        question: "What wines do you make?",
        answer: "We make three wines, in several vintages: a Brouilly (red, Gamay), a Beaujolais-Villages blanc and a Bourgogne blanc (Chardonnay).",
    },
    {
        question: "Do you offer visits and tastings?",
        answer: "Yes, we welcome visitors for tastings and visits of the estate, Monday to Saturday from 9 am to 6 pm. Booking is recommended: call us or write to us before you come.",
    },
    {
        question: "Can I order your wines online?",
        answer: "There is no online payment for now. Choose your wines on the site, then send us your order with the contact form, or call us. We ship from our cellar in Odenas anywhere in France, or you can collect them at the estate.",
    },
    {
        question: "Do you welcome groups?",
        answer: "Yes, we can welcome groups for guided tastings. Please contact us through the form to arrange your visit.",
    },
];

// Textes des vins, par adresse de la fiche (slug). Le nom et le millésime ne se traduisent pas.
export const VINS_EN: Record<string, { subtitle?: string; description?: string; parcelle?: string; vinification?: string }> = {
    brouilly: {
        subtitle: "Beaujolais cru — Red — Lieu-dit Garanches",
        description: "A generous wine that builds its structure over time. Romain and Aurélie's first cuvée at Garanches.\n\nRaspberry and fresh fig lead on the nose and on the palate. A lovely attack that feels like biting into fruit. The tannins are silky and the finish long and generous.",
    },
    "brouilly-2024": {
        subtitle: "Beaujolais cru — Red — Lieu-dit Garanches",
        description: "A fine wine for laying down.\n\nRaspberries and wild strawberries lead on the nose and on the palate. A lovely attack that feels like biting into fresh, tangy fruit. The tannins are silky and the finish long and generous. The freshness of the vintage fully envelops the oak ageing, which balances the aromas perfectly.",
        vinification: "This Brouilly is aged as several separate cuvées.\n\n**Le musée cuvée**\nLe musée is an old vineyard on sandy granite soil, mostly pink. This gives tauter, fresher wines with a tangy palate: wild strawberry, blackcurrant, raspberry. Its south-facing exposure brings earlier flowering, faster-ripening berries and an intense aromatic richness. Sunshine and sand give the wine lightness and make it enjoyable from its youth.\n\n**Le parc cuvée**\nLe parc faces east, on more clay-rich granite soil, which gives the wine more breadth and depth on the palate. The fruit stays fresh but juicier, with aromas of intense cherry and soft, peppery spice.\n\n**Barrel cuvée, 24 months in demi-muids**\nA generous nose of ripe black fruit and juicy cherry, with delicate smoky and vanilla notes lifted by hints of coffee and cocoa. The palate is broad and fleshy, with a rich fruitiness. The perfectly integrated oak accompanies the wine elegantly without masking the fruit.",
    },
    "brouilly-2025": {
        subtitle: "Beaujolais cru — Red — Lieu-dit Garanches",
        description: "A fine wine for laying down.\n\nA nose of freshly crushed strawberries and small red berries. A sunny palate, full of energy, carried by lovely intensity and fine tannins. The fresh, mouth-watering finish invites you to linger over the conversation… and the pleasure of sharing.",
    },
    "bourgogne-blanc": {
        subtitle: "Chardonnay",
        description: "A wine worthy of the fine Burgundies we love.\n\nA nose and palate of lightly honeyed floral notes, giving a rich feel in the mouth over tangy white fruit. A long finish of toasted vanilla notes is this wine's greatest charm.",
    },
    "bourgogne-blanc-2025": {
        subtitle: "Chardonnay",
        description: "A sun-drenched vintage that gives the wine notes of exotic fruit.\n\nHoneyed, smooth and generous, with flowers leading on the nose and the palate. Pear, pineapple and apricot, fresh and slightly tangy, add complexity to the tasting.",
    },
    "beaujolais-villages-blanc": {
        subtitle: "Beaujolais-Villages — White",
        description: "A true spring Beaujolais.\n\nThe Beaujolais-Villages blanc shows an appealing balance, floral, fruity and tangy. Lemon, acacia and hawthorn blossom are the very identity of this wine, with a fresh, mouth-watering finish.",
    },
};

// Cépages et accords (étiquettes des vins).
export const MOTS_VINS_EN: Record<string, string> = {
    gamay: "Gamay",
    chardonnay: "Chardonnay",
    "pinot noir": "Pinot Noir",
    aligoté: "Aligoté",
    "viandes rouges": "Red meat",
    "viande rouge": "Red meat",
    "viandes blanches": "White meat",
    volailles: "Poultry",
    fromages: "Cheese",
    fromage: "Cheese",
    poissons: "Fish",
    poisson: "Fish",
    "fruits de mer": "Seafood",
    apéritif: "Aperitif",
    charcuterie: "Charcuterie",
    desserts: "Desserts",
    "cuisine asiatique": "Asian cuisine",
    grillades: "Grilled food",
};

// Appellation et couleur saisies dans le studio (« Cru du Beaujolais — Rouge »), mot à mot.
export const SOUS_TITRES_EN: Record<string, string> = {
    "cru du beaujolais": "Beaujolais cru",
    "lieu-dit garanches": "Lieu-dit Garanches",
    rouge: "Red",
    blanc: "White",
    rosé: "Rosé",
};
