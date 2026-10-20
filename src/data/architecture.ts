// Arborescence du site, d'après le document maître « Architecture site Garanches ».
// Chaque bloc peut être remplacé depuis le studio Sanity (document « Bloc de texte »),
// avec la clé `${page.path}#${bloc.id}`. Sans contenu Sanity, les textes ci-dessous s'affichent.

export type Bloc = {
    id: string;
    title?: string;
    // Paragraphes séparés par une ligne vide ; **gras** accepté.
    body?: string;
    image?: string;
    alt?: string;
    cta?: { label: string; href: string };
    // Sujet pré-rempli dans le formulaire de contact pour le bouton « Réserver ».
    booking?: { label: string; sujet: string };
    // Informations pratiques (durée, personnes, tarifs, accès) pour rassurer avant d'agir.
    pratique?: { label: string; value: string }[];
};

export type Page = {
    path: string;
    label: string;
    description: string;
    image: string;
    // Libellé du bouton quand la page est présentée en carte.
    cta: string;
    blocs: Bloc[];
    // Pages proposées en suite de lecture (chemins internes).
    children?: string[];
};

export type Porte = { path: string; label: string; children: { label: string; href: string }[] };

const PAGE_LIST: Page[] = [
    // ─────────────── LE LIEU ───────────────
    {
        path: "le-lieu",
        label: "Le Lieu",
        description: "Entrer dans l'univers de Garanches, à Odenas, au pied du Mont Brouilly.",
        image: "/images/23_slide002.jpg",
        cta: "Entrer",
        blocs: [
            {
                id: "introduction",
                title: "Là où tout commence.",
                body: `À Odenas, au pied du Mont Brouilly, Garanches est un lieu façonné par le temps, le granit et les générations qui l'ont fait vivre.
Ses vignes, ses parcelles et ses paysages portent cette histoire.
Une terre vit par ceux qui la travaillent, la regardent évoluer et la transmettent.
Et aujourd'hui, par celles et ceux qui viennent la découvrir, goûter ses vins et partager un moment à Garanches.`,
                image: "/images/11_image.jpg",
                alt: "Le domaine de Garanches et ses vignes",
            },
        ],
        children: ["le-lieu/le-domaine", "le-lieu/histoire", "le-lieu/traces", "le-lieu/ceux-qui-le-font-vivre", "carnets"],
    },
    {
        path: "le-lieu/le-domaine",
        label: "Le domaine",
        description: "Odenas, le Mont Brouilly, le granit et les vignes de Garanches.",
        image: "/images/11_image.jpg",
        cta: "Découvrir le domaine",
        blocs: [
            {
                id: "le-lieu",
                title: "Le lieu",
                image: "/images/23_slide002.jpg",
                alt: "Paysage du domaine de Garanches",
            },
            {
                id: "les-vignes",
                title: "Mont Brouilly.",
                body: `Ici, le granit se décline du bleu au rose, et les générations de vignes se côtoient : certaines ont près de 150 ans, d'autres n'ont que quelques années.

Chaque parcelle, chaque âge de vigne, chaque exposition apporte sa propre lecture du lieu.

Nous les regardons vivre au fil des saisons, avec ce qu'elles portent du passé et ce qu'elles promettent pour demain.`,
                image: "/images/16_image.jpg",
                alt: "Vignes au pied du Mont Brouilly",
                cta: { label: "Découvrir les vignes", href: "/rencontrons-garanches/decouvrir-les-vignes" },
            },
        ],
        children: ["le-lieu/histoire", "les-vins/terroirs"],
    },
    {
        path: "le-lieu/histoire",
        label: "L'histoire",
        description: "Histoire du domaine de Garanches, personnages clés et archives.",
        image: "/images/10_slide003.jpg",
        cta: "Entrer dans l'histoire",
        blocs: [
            {
                id: "introduction",
                title: "Une histoire qui continue.",
                body: `Garanches porte une histoire qui dépasse largement celle d'une propriété.

Des hommes et des femmes y ont travaillé, réfléchi, transmis et parfois dû inventer pour que la vigne puisse continuer.

Certaines de leurs histoires ont même dépassé Garanches et rejoint celle du vignoble français.

Aujourd'hui, nous en gardons les traces et nous continuons à les faire vivre.`,
                image: "/images/10_slide003.jpg",
                alt: "Archives manuscrites du domaine",
            },
            {
                id: "personnages-cles",
                title: "Celles et ceux qui ont marqué Garanches.",
                body: `L'histoire de Garanches s'écrit aussi à travers des personnalités dont le parcours a compté bien au-delà du domaine.

Jean Buy, Emmanuel Bender, Émile Bender et d'autres ont laissé leur empreinte dans l'histoire de la vigne, du vin et de son organisation.

Nous avons choisi de raconter leurs histoires simplement, à partir des traces qu'ils nous ont laissées.

Parce qu'un lieu se comprend aussi à travers celles et ceux qui l'ont façonné.`,
                image: "/images/34_slide001.jpg",
                alt: "Cave du domaine de Garanches",
            },
        ],
        children: ["le-lieu/traces", "le-lieu/ceux-qui-le-font-vivre"],
    },
    {
        path: "le-lieu/traces",
        label: "Traces",
        description: "Plants anciens, documents, photographies et archives de Garanches.",
        image: "/images/10_slide003.jpg",
        cta: "Voir les traces",
        blocs: [
            {
                id: "introduction",
                title: "Ce que le temps nous a laissé.",
                body: `Documents, photographies, textes, objets et archives racontent une autre façon d'entrer dans l'histoire de Garanches.

Certaines traces sont précises. D'autres ouvrent des questions.

Nous les conservons parce qu'elles donnent à voir le domaine autrement : à travers ceux qui l'ont connu, travaillé et pensé avant nous.

Ici, l'histoire se découvre au fil des traces.`,
                image: "/images/12_image.jpg",
                alt: "Traces et objets du domaine",
                cta: { label: "Voir les Carnets", href: "/carnets" },
            },
            { id: "plants-anciens", title: "Plants anciens", image: "/images/16_image.jpg", alt: "Vieilles vignes de Garanches" },
            { id: "documents", title: "Documents", image: "/images/10_slide003.jpg", alt: "Archives manuscrites du domaine" },
        ],
        children: ["le-lieu/histoire", "carnets"],
    },
    {
        path: "le-lieu/ceux-qui-le-font-vivre",
        label: "Ceux qui le font vivre",
        description: "Les personnes, les gestes et la transmission qui font vivre Garanches.",
        image: "/images/22_image.jpg",
        cta: "Découvrir",
        blocs: [
            {
                id: "introduction",
                title: "Ceux qui le font vivre",
                image: "/images/0_image.jpg",
                alt: "Geste de vendange au domaine",
            },
        ],
        children: ["le-lieu/histoire", "rencontrons-garanches"],
    },

    // ─────────────── LES VINS ───────────────
    {
        path: "les-vins",
        label: "Les Vins",
        description: "Les vins du domaine de Garanches : notre façon de faire, nos cuvées, nos terroirs.",
        image: "/images/34_slide001.jpg",
        cta: "Découvrir les vins",
        blocs: [
            {
                id: "introduction",
                title: "Des vins qui viennent d'un lieu.",
                body: `À Garanches, chaque vin commence par une attention portée à la terre, aux vignes et aux saisons.
Parfois une parcelle.
Parfois plusieurs.
Nous assemblons, élevons et faisons évoluer nos vins avec une même exigence : trouver l'expression juste de chaque cuvée.
Des vins précis, vivants, en petites quantités.
Des vins qui racontent Garanches, chacun à leur manière.`,
                image: "/images/33_image.jpg",
                alt: "Vendanges dans les vignes de Garanches",
            },
        ],
        children: [
            "les-vins/notre-facon-de-faire",
            "les-vins/cuvees",
            "le-lieu/histoire",
            "les-vins/terroirs",
            "rencontrons-garanches/les-rencontres",
            "les-vins/a-table",
        ],
    },
    {
        path: "les-vins/notre-facon-de-faire",
        label: "Notre façon de faire",
        description: "Terre, vignes, saisons, millésimes, élevage et assemblages à Garanches.",
        image: "/images/0_image.jpg",
        cta: "Découvrir notre façon de faire",
        blocs: [
            { id: "introduction", title: "Notre façon de faire", image: "/images/0_image.jpg", alt: "Gestes de vendange" },
            {
                id: "terre-vignes-saisons",
                title: "Terre, vignes et saisons",
                image: "/images/42_image.jpg",
                alt: "Les vignes au fil des saisons",
            },
            {
                id: "millesime-et-temps",
                title: "Millésime et temps",
                image: "/images/31_image.jpg",
                alt: "Cuves du chai",
            },
        ],
        children: ["les-vins/cuvees", "les-vins/terroirs"],
    },
    {
        path: "les-vins/cuvees",
        label: "Les cuvées",
        description: "Les cuvées du domaine de Garanches : Brouilly, Bourgogne blanc, rosé et méthode traditionnelle.",
        image: "/images/36_brouilly-h.jpg",
        cta: "Voir les cuvées",
        blocs: [{ id: "introduction", title: "Les cuvées" }],
        children: ["les-vins/a-table", "acheter"],
    },
    {
        path: "les-vins/terroirs",
        label: "Les terroirs",
        description: "Parcelles, sols et granit : les terroirs de Garanches.",
        image: "/images/23_slide002.jpg",
        cta: "Découvrir les terroirs",
        blocs: [{ id: "introduction", title: "Les terroirs", image: "/images/19_image.jpg", alt: "Parcelles du domaine" }],
        children: ["le-lieu/le-domaine", "rencontrons-garanches/decouvrir-les-vignes"],
    },
    {
        path: "les-vins/a-table",
        label: "À table",
        description: "Plats, accords et moments de dégustation avec les vins de Garanches.",
        image: "/images/3_image.jpg",
        cta: "À table",
        blocs: [{ id: "introduction", title: "À table", image: "/images/40_image.jpg", alt: "Dégustation d'un vin de Garanches" }],
        children: ["les-vins/cuvees", "rencontrons-garanches/les-rencontres"],
    },

    // ─────────────── RENCONTRONS GARANCHES ───────────────
    {
        path: "rencontrons-garanches",
        label: "Rencontrons Garanches",
        description: "Entrez, goûtez, échangez : table d'hôtes, dégustations, visites et expériences privées à Garanches.",
        image: "/images/3_image.jpg",
        cta: "Découvrir les Rencontres",
        blocs: [
            {
                id: "introduction",
                title: "Entrez, goûtez, échangez. Rencontrons-nous à Garanches.",
                body: `Il y a mille façons de découvrir un domaine.
Une promenade dans les vignes.
Un verre partagé.
Une dégustation.
Une conversation.
Que l'on connaisse déjà le vin ou que l'on ait simplement envie de découvrir, nous aimons ouvrir Garanches et prendre le temps de vous accueillir.
Parce qu'ici, les vins se découvrent aussi avec le lieu et avec ceux qui le font vivre.`,
                image: "/images/40_image.jpg",
                alt: "Dégustation au domaine",
            },
        ],
        children: [
            "rencontrons-garanches/les-rencontres",
            "rencontrons-garanches/deguster-au-domaine",
            "rencontrons-garanches/decouvrir-les-vignes",
            "rencontrons-garanches/experiences-privees",
            "rencontrons-garanches/evenements",
        ],
    },
    {
        path: "rencontrons-garanches/les-rencontres",
        label: "Les Rencontres de Garanches",
        description: "Table d'hôtes, vins, repas et conversations au domaine de Garanches.",
        image: "/images/3_image.jpg",
        cta: "Découvrir les Rencontres",
        blocs: [
            {
                id: "introduction",
                title: "Ensemble, passons à table !",
                body: `Autour de la table, une bouteille s'ouvre, les verres se remplissent, les conversations commencent.
Un plat rencontre un vin.
Un vin raconte une histoire.
Une histoire en appelle une autre...
Partageons nos impressions, nos questions, nos découvertes, et laissons la conversation nous emmener.`,
                image: "/images/3_image.jpg",
                alt: "Autour d'une table à Garanches",
            },
            { id: "esprit", title: "L'esprit de la rencontre", image: "/images/34_slide001.jpg", alt: "La cave de Garanches" },
            {
                id: "comment-ca-se-passe",
                title: "Comment ça se passe ?",
                pratique: [
                    { label: "Durée", value: "À préciser" },
                    { label: "Personnes", value: "À préciser" },
                    { label: "Tarifs", value: "À préciser" },
                    { label: "Accès", value: "345 chemin de Garanches, Odenas" },
                ],
                booking: { label: "Réserver", sujet: "Les Rencontres de Garanches" },
            },
        ],
        children: ["rencontrons-garanches/deguster-au-domaine", "rencontrons-garanches/experiences-privees"],
    },
    {
        path: "rencontrons-garanches/deguster-au-domaine",
        label: "Déguster au domaine",
        description: "Visite de la cave et dégustation au domaine de Garanches, à Odenas.",
        image: "/images/34_slide001.jpg",
        cta: "Déguster au domaine",
        blocs: [
            {
                id: "introduction",
                title: "Chut… les vins travaillent.",
                body: `**Poussons la porte.**

Entrons dans la cave.

Découvrons les vinifications, les élevages et les choix qui façonnent nos cuvées.

Échangeons autour du vin, de ses gestes et de son évolution.

Puis goûtons quelques cuvées au cœur de leur histoire.

**Du chai au verre, partageons le chemin du vin.**`,
                image: "/images/34_slide001.jpg",
                alt: "La cave et ses fûts",
            },
            {
                id: "comment-ca-se-passe",
                title: "Comment ça se passe ?",
                // Informations pratiques reprises de l'ancienne page « Visite ».
                body: `Le domaine est ouvert du lundi au samedi, de 9h à 18h. Il est fermé le dimanche et les jours fériés.

Nous recevons avec plaisir les visiteurs individuels comme les groupes. Pour vous garantir le meilleur accueil, **une réservation est conseillée**, par téléphone au 04 74 03 44 80 ou avec le bouton ci-dessous.

345 chemin de Garanches, 69460 Odenas.`,
                pratique: [
                    { label: "Durée", value: "À préciser" },
                    { label: "Personnes", value: "Individuels et groupes" },
                    { label: "Tarifs", value: "À préciser" },
                    { label: "Accès", value: "345 chemin de Garanches, Odenas" },
                ],
                booking: { label: "Réserver", sujet: "Déguster au domaine" },
            },
        ],
        children: ["rencontrons-garanches/decouvrir-les-vignes", "rencontrons-garanches/les-rencontres"],
    },
    {
        path: "rencontrons-garanches/decouvrir-les-vignes",
        label: "Découvrir les vignes",
        description: "Une promenade dans les parcelles de Garanches, puis quatre vins à goûter.",
        image: "/images/42_image.jpg",
        cta: "Découvrir les vignes",
        blocs: [
            {
                id: "introduction",
                title: "Enfilez vos bottes et devenez vigneron le temps d'une visite !",
                body: `Une promenade dans nos parcelles pour découvrir la vigne au fil des saisons, comprendre nos gestes et regarder le terroir autrement.

Puis quatre vins à goûter, pour retrouver dans le verre ce que nous venons de découvrir dans les vignes.

**Du sol au verre, entrez dans l'univers de Garanches.**`,
                image: "/images/42_image.jpg",
                alt: "Dans les vignes de Garanches",
            },
            {
                id: "comment-ca-se-passe",
                title: "Comment ça se passe ?",
                pratique: [
                    { label: "Durée", value: "À préciser" },
                    { label: "Personnes", value: "À préciser" },
                    { label: "Tarifs", value: "À préciser" },
                    { label: "Accès", value: "345 chemin de Garanches, Odenas" },
                ],
                booking: { label: "Réserver", sujet: "Découvrir les vignes" },
            },
        ],
        children: ["rencontrons-garanches/deguster-au-domaine", "les-vins/terroirs"],
    },
    {
        path: "rencontrons-garanches/experiences-privees",
        label: "Expériences privées",
        description: "Famille, amis, associations, équipes : des moments privés à Garanches, jusqu'à une vingtaine de personnes.",
        image: "/images/11_image.jpg",
        cta: "Imaginer une expérience",
        blocs: [
            {
                id: "introduction",
                title: "Retrouvons-nous autrement !",
                body: `À Garanches, nous accueillons de petits groupes, jusqu'à une vingtaine de personnes, pour partager un moment qui nous ressemble.

Une réunion d'association, un rendez-vous d'équipe, une rencontre entre amis…

Autour d'une table, dans les vignes ou au cœur du domaine, nous imaginons ensemble un moment simple, convivial et vivant.

**Un lieu pour se retrouver, échanger et prendre le temps.**`,
                image: "/images/11_image.jpg",
                alt: "Un groupe réuni dans les vignes de Garanches",
            },
            {
                id: "comment-ca-se-passe",
                title: "Et si nous prenions le temps de nous retrouver ?",
                body: `À Garanches, nous imaginons des moments privés pour les petits groupes, jusqu'à une vingtaine de personnes.

Un repas, quelques bouteilles, une promenade dans les vignes, une découverte de la cave…

Nous choisissons ensemble ce qui donnera à ce moment sa couleur.

**Un lieu à partager, un moment à garder.**`,
                pratique: [
                    { label: "Durée", value: "À imaginer ensemble" },
                    { label: "Personnes", value: "Jusqu'à une vingtaine" },
                    { label: "Tarifs", value: "Sur demande" },
                    { label: "Accès", value: "345 chemin de Garanches, Odenas" },
                ],
                booking: { label: "Demander", sujet: "Expérience privée" },
            },
        ],
        children: ["rencontrons-garanches/les-rencontres", "rencontrons-garanches/decouvrir-les-vignes"],
    },

    {
        path: "rencontrons-garanches/evenements",
        label: "Événements",
        description: "Repas et rencontres au domaine de Garanches, au fil de l'année.",
        image: "/images/21_image.jpg",
        cta: "Découvrir les événements",
        blocs: [
            { id: "introduction", title: "Événements", image: "/images/3_image.jpg", alt: "Un repas au domaine" },
            {
                id: "comment-ca-se-passe",
                title: "Comment ça se passe ?",
                pratique: [
                    { label: "Dates", value: "À préciser" },
                    { label: "Personnes", value: "À préciser" },
                    { label: "Tarifs", value: "À préciser" },
                    { label: "Accès", value: "345 chemin de Garanches, Odenas" },
                ],
                booking: { label: "Réserver", sujet: "Événements" },
            },
        ],
        children: ["rencontrons-garanches/les-rencontres", "carnets"],
    },

    // ─────────────── TRANSVERSAL ───────────────
    {
        path: "acheter",
        label: "Acheter / Trouver Garanches",
        description: "Commander les vins de Garanches en ligne ou les trouver chez les cavistes et restaurants.",
        image: "/images/36_brouilly-h.jpg",
        cta: "Trouver Garanches",
        blocs: [
            {
                id: "commander",
                title: "Commander",
                body: `Nos vins sont expédiés directement depuis notre cave à Odenas, partout en France.`,
                image: "/images/34_slide001.jpg",
                alt: "La cave de Garanches",
                cta: { label: "Commander", href: "/les-vins/cuvees" },
            },
            { id: "restaurants-cavistes", title: "Restaurants et cavistes" },
        ],
        children: ["rencontrons-garanches/deguster-au-domaine"],
    },
];

export const PAGES: Record<string, Page> = Object.fromEntries(PAGE_LIST.map((p) => [p.path, p]));

// Les Carnets ont leur propre route (articles publiés dans Sanity).
export const CARNETS_CARD = {
    path: "carnets",
    label: "Les Carnets de Garanches",
    description: "Des histoires de vignes, de vins, de rencontres et de ceux qui font vivre Garanches.",
    image: "/images/0_image.jpg",
    cta: "Voir les Carnets",
};

export const CARNETS_INTRO = {
    title: "Entrer dans le carnet.",
    body: `Des histoires de vignes, de vins, de rencontres et de ceux qui font vivre Garanches.
Un regard sur ce qui se passe ici, au fil des saisons.`,
};

export const CARNET_THEMES = [
    { title: "La vigne", value: "vigne" },
    { title: "Les vins", value: "vins" },
    { title: "Le lieu", value: "lieu" },
    { title: "L'histoire", value: "histoire" },
    { title: "Les rencontres", value: "rencontres" },
];

export function card(path: string) {
    if (path === "carnets") return CARNETS_CARD;
    const p = PAGES[path];
    return { path, label: p.label, description: p.description, image: p.image, cta: p.cta };
}

// Les trois portes du menu.
export const PORTES: Porte[] = ["le-lieu", "les-vins", "rencontrons-garanches"].map((path) => ({
    path: `/${path}`,
    label: PAGES[path].label,
    children: PAGES[path].children!.map((child) => ({ label: card(child).label, href: `/${child}` })),
}));

// Clés proposées dans le studio pour remplacer un bloc.
export const BLOC_KEYS = PAGE_LIST.flatMap((p) =>
    p.blocs.map((b) => ({ title: `${p.label} › ${b.title || b.id}`, value: `${p.path}#${b.id}` }))
);

// Pages dont le chemin est servi par la route générique /[porte]/[page].
export const GENERIC_PATHS = PAGE_LIST.map((p) => p.path);

// Accueil, d'après le schéma « Architecture générale du site ».
export const SIGNATURE = "Un lieu. Des vins. Une histoire à vivre.";

export const HOME_PORTES = [
    {
        path: "le-lieu",
        image: "/images/23_slide002.jpg",
        entrees: [
            { label: "Le domaine", motsCles: "Odenas • paysage • granit • vignes", href: "/le-lieu/le-domaine" },
            { label: "L'histoire", motsCles: "Bender • Jean Buy • archives • traces", href: "/le-lieu/histoire" },
        ],
    },
    {
        path: "les-vins",
        image: "/images/34_slide001.jpg",
        entrees: [
            { label: "Notre façon de faire", motsCles: "Terre • saisons • millésimes • temps", href: "/les-vins/notre-facon-de-faire" },
            { label: "Les cuvées", motsCles: "Terroirs • assemblages • à table", href: "/les-vins/cuvees" },
        ],
    },
    {
        path: "rencontrons-garanches",
        image: "/images/40_image.jpg",
        entrees: [
            { label: "Les Rencontres", motsCles: "Table d'hôtes • vins • conversations", href: "/rencontrons-garanches/les-rencontres" },
            { label: "Expériences", motsCles: "Dégustations • vignes • privé • événements", href: "/rencontrons-garanches" },
        ],
    },
].map((porte) => ({ ...porte, page: PAGES[porte.path] }));
