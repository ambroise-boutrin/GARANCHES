// Version anglaise des pages de src/data/architecture.ts, page par page et bloc par bloc.
// Seuls les textes changent : photos, adresses et mise en page restent ceux du français.
// Dans le studio, chaque texte a un champ « anglais » : s'il est rempli, il remplace celui d'ici.

export type BlocEn = {
    title?: string;
    body?: string;
    alt?: string;
    /** Texte du lien ou du bouton du bloc. */
    bouton?: string;
    pratique?: { label: string; value: string }[];
};

export type PageEn = { label: string; description: string; cta: string; blocs?: Record<string, BlocEn> };

const ACCES = { label: "Access", value: "345 chemin de Garanches, Odenas" };
const A_PRECISER = "To be confirmed";

export const PAGES_EN: Record<string, PageEn> = {
    // ─────────────── THE PLACE ───────────────
    "le-lieu": {
        label: "The Place",
        description: "Step into the world of Garanches, in Odenas, at the foot of Mont Brouilly.",
        cta: "Come in",
        blocs: {
            introduction: {
                title: "Where it all begins.",
                body: `In Odenas, at the foot of Mont Brouilly, Garanches is a place shaped by time, by granite and by the generations who brought it to life.
Its vines, its plots and its landscapes carry that story.
A land lives through those who work it, watch it change and pass it on.
And today, through everyone who comes to discover it, taste its wines and share a moment at Garanches.`,
                alt: "The Garanches house, seen from the courtyard",
            },
        },
    },
    "le-lieu/le-domaine": {
        label: "The estate",
        description: "Odenas, Mont Brouilly, granite and the vines of Garanches.",
        cta: "Discover the estate",
        blocs: {
            "le-lieu": {
                title: "The place",
                alt: "The Garanches house behind a granite boulder",
            },
            "les-vignes": {
                title: "Mont Brouilly.",
                body: `Here the granite ranges from blue to pink, and generations of vines grow side by side: some are nearly 150 years old, others only a few years.

Each plot, each age of vine, each exposure gives its own reading of the place.

We watch them live through the seasons, with what they carry from the past and what they promise for tomorrow.`,
                alt: "The Garanches vineyard in autumn, with a vineyard hut among the rows",
                bouton: "Walk the vineyard",
            },
        },
    },
    "le-lieu/histoire": {
        label: "The history",
        description: "The history of the Garanches estate, the people who shaped it and its archives.",
        cta: "Step into the history",
        blocs: {
            introduction: {
                title: "A story that goes on.",
                body: `Garanches carries a story that goes far beyond that of a single property.

Men and women worked here, thought, passed things on and sometimes had to invent so that the vines could carry on.

Some of their stories even went beyond Garanches and became part of the history of French winegrowing.

Today we keep their traces and keep them alive.`,
                alt: "Diploma from the Lyon Universal and Colonial Exhibition, 1894",
            },
            "personnages-cles": {
                title: "The people who left their mark on Garanches.",
                body: `The story of Garanches is also written through people whose lives mattered far beyond the estate.

Jean Buy, Emmanuel Bender, Émile Bender and others left their mark on the history of the vine, of wine and of how it is organised.

We have chosen to tell their stories simply, from the traces they left us.

Because a place is also understood through the people who shaped it.`,
                alt: "Framed diploma of honour, Garanches archives",
            },
            "jean-buy": {
                title: "Jean Buy",
                body: `**At the origins of Garanches**

The first of the family line to settle at Garanches, Jean Buy took part in the political life of the Beaujolais on the eve of the French Revolution, in a land of mixed farming where vines grew alongside other crops.

Involved in gathering the grievances of 1789, well beyond the parish of Odenas, he became the village's first mayor in 1790.

His life belongs to a time of deep political, economic and agricultural change, which gradually shaped the wine-growing Beaujolais we know today.`,
                alt: "Marquetry dated 1790 showing Jean Buy, the only known image of him",
            },
            "emmanuel-bender": {
                title: "Emmanuel Bender (1840–1900)",
                body: `**The apostle of replanting**

A justice of the peace in Lyon and president of the Lyon Regional Viticulture Society, Emmanuel Bender devoted his life to the vine at the very moment phylloxera was destroying it.

With his friend Victor Pulliat, he was one of the first to replant the vineyards of the Beaujolais and the Mâconnais. Journeys, lectures, trials: he took whole caravans of winegrowers to the south of France, already replanted, so they could see with their own eyes that the vine could be reborn.

With Pulliat he published many booklets on the vine, and he chaired the Lyon Viticulture Congress in 1894.

When he died in 1900, Victor Vermorel paid tribute to him: "the Beaujolais winegrowers, whose enlightened and respected guide he was, who came to his vineyard in Odenas to see good methods put into practice and gather precious advice, will owe him eternal gratitude."`,
                alt: "Victor Vermorel's tribute to Emmanuel Bender (1840–1900), with his portrait",
            },
            "emile-bender": {
                title: "Émile Bender (1871–1953)",
                body: `**At the foundations of appellations of origin**

A member of parliament and then senator for the Rhône, Émile Bender was one of the architects of French wine law.

Alongside other members of parliament, notably Joseph Capus, he helped shape the idea of an appellation of origin, linking the name of a wine to its land, its grape varieties and its ways of making wine.

His work as a lawmaker, notably the Capus-Bender law of 22 July 1927, helped lay the foundations of the future system of controlled appellations of origin (AOC).`,
                alt: "Photographic portrait of Émile Bender",
            },
        },
    },
    "le-lieu/traces": {
        label: "Traces",
        description: "Old vines, documents, photographs and archives from Garanches.",
        cta: "See the traces",
        blocs: {
            introduction: {
                title: "What time has left us.",
                body: `Documents, photographs, writings, objects and archives offer another way into the history of Garanches.

Some traces are precise. Others raise questions.

We keep them because they show the estate in a different light: through those who knew it, worked it and thought about it before us.

Here, history is discovered trace by trace.`,
                alt: "An old latch on one of the estate's doors",
                bouton: "Read the Notebooks",
            },
            "plants-anciens": { title: "Old vines" },
            documents: { title: "Documents", alt: "Diploma from the great wines of France competition, Mâcon 1968" },
        },
    },
    "le-lieu/ceux-qui-le-font-vivre": {
        label: "The people behind it",
        description: "The people, the craft and the passing on of knowledge that keep Garanches alive.",
        cta: "Discover",
        blocs: {
            introduction: { title: "The people behind it" },
        },
    },

    // ─────────────── THE WINES ───────────────
    "les-vins": {
        label: "The Wines",
        description: "The wines of the Garanches estate: our approach, our cuvées, our terroirs.",
        cta: "Discover the wines",
        blocs: {
            introduction: {
                title: "Wines that come from a place.",
                body: `At Garanches, every wine begins with close attention to the soil, the vines and the seasons.
Sometimes a single plot.
Sometimes several.
We blend, age and nurture our wines with the same aim: to find the right expression for each cuvée.
Precise, lively wines, made in small quantities.
Wines that tell the story of Garanches, each in its own way.`,
                alt: "A handful of freshly picked grapes in the Garanches vineyard",
            },
        },
    },
    "les-vins/notre-facon-de-faire": {
        label: "Our approach",
        description: "Soil, vines, seasons, vintages, ageing and blending at Garanches.",
        cta: "Discover our approach",
        blocs: {
            introduction: { title: "Our approach", alt: "Aurélie Crozet showing a vine in the Garanches vineyard" },
            "terre-vignes-saisons": { title: "Soil, vines and seasons", alt: "The Garanches vineyard in autumn, in front of the tall trees of the park" },
            "millesime-et-temps": { title: "Vintage and time", alt: "A vine with red leaves in autumn" },
        },
    },
    "les-vins/cuvees": {
        label: "Our cuvées",
        description: "The cuvées of the Garanches estate: Brouilly, Beaujolais-Villages blanc and Bourgogne blanc.",
        cta: "See the cuvées",
        blocs: {
            introduction: {
                title: "Our cuvées",
                body: `The estate's Brouilly, Beaujolais-Villages blanc and Bourgogne blanc, presented vintage by vintage.`,
                alt: "The three wines of the Garanches estate: Beaujolais-Villages blanc, Brouilly and Bourgogne blanc",
            },
        },
    },
    "les-vins/terroirs": {
        label: "The terroirs",
        description: "Plots, soils and granite: the terroirs of Garanches.",
        cta: "Discover the terroirs",
        blocs: {
            introduction: { title: "The terroirs", alt: "The vineyard plots around Garanches, seen from the sky" },
        },
    },
    "les-vins/a-table": {
        label: "At the table",
        description: "Dishes, pairings and tasting moments with the wines of Garanches.",
        cta: "At the table",
        blocs: {
            introduction: { title: "At the table" },
        },
    },

    // ─────────────── MEET GARANCHES ───────────────
    "rencontrons-garanches": {
        label: "Meet Garanches",
        description: "Come in, taste, talk: shared tables, tastings, visits and private experiences at Garanches.",
        cta: "Discover our visits",
        blocs: {
            introduction: {
                title: "Come in, taste, talk. Let's meet at Garanches.",
                body: `There are a thousand ways to discover an estate.
A walk through the vines.
A shared glass.
A tasting.
A conversation.
Whether you already know the wine or are simply curious, we love opening Garanches and taking the time to welcome you.
Because here, the wines are also discovered through the place and the people who bring it to life.`,
                alt: "Isabelle Stagnara on the Garanches terrace",
            },
        },
    },
    "rencontrons-garanches/les-rencontres": {
        label: "Shared tables",
        description: "Shared tables, wines, meals and conversations at the Garanches estate.",
        cta: "Discover the shared tables",
        blocs: {
            introduction: {
                title: "Let's sit down together!",
                body: `Around the table, a bottle is opened, glasses are filled, conversations begin.
A dish meets a wine.
A wine tells a story.
One story leads to another...
Let's share our impressions, our questions, our discoveries, and let the conversation take us where it will.`,
            },
            esprit: {
                title: "The Garanches shared table",
                body: `**Sometimes we arrive as strangers, we often leave as friends!**

On your own, as a couple or with friends, take a seat at our table alongside guests from near and far.

Romain prepares a generous meal to bring out the flavours of our wines.

We taste, we talk, we laugh, the conversation livens up... and friendships begin!

At the end of the meal, addresses are swapped and reunions planned... sometimes even around another table at Garanches.

**A moment to savour, where wine brings us together and the encounter does the rest.**`,
            },
            "comment-ca-se-passe": {
                title: "How does it work?",
                pratique: [
                    { label: "Duration", value: A_PRECISER },
                    { label: "Guests", value: A_PRECISER },
                    { label: "Rates", value: A_PRECISER },
                    ACCES,
                ],
                bouton: "Book",
            },
        },
    },
    "rencontrons-garanches/deguster-au-domaine": {
        label: "Tastings at the estate",
        description: "Cellar visit and wine tasting at the Garanches estate, in Odenas.",
        cta: "Taste at the estate",
        blocs: {
            introduction: {
                title: "Hush… the wines are at work.",
                body: `**Let's push open the door.**

Step into the cellar.

Discover the winemaking, the ageing and the choices that shape our cuvées.

Let's talk about wine, the craft behind it and how it evolves.

Then taste a few cuvées at the heart of their story.

**From cellar to glass, let's share the journey of the wine.**`,
                alt: "The wine press in the Garanches cellar",
            },
            "comment-ca-se-passe": {
                title: "How does it work?",
                body: `The estate is open Monday to Saturday, 9 am to 6 pm. It is closed on Sundays and French public holidays.

We are happy to welcome individual visitors as well as groups. To make sure we can give you the best welcome, **booking is recommended**, by phone or with the button below:
**Isabelle: +33 6 61 73 56 67**
**Aurélie: +33 6 58 83 46 80**
Romain: +33 7 82 24 94 36
Michel: +33 6 09 41 97 02

345 chemin de Garanches, 69460 Odenas, France.`,
                pratique: [
                    { label: "Duration", value: A_PRECISER },
                    { label: "Guests", value: "Individuals and groups" },
                    { label: "Rates", value: A_PRECISER },
                    ACCES,
                ],
                bouton: "Book",
            },
        },
    },
    "rencontrons-garanches/decouvrir-les-vignes": {
        label: "Vineyard walk",
        description: "A walk through the Garanches plots, followed by four wines to taste.",
        cta: "Walk the vineyard",
        blocs: {
            introduction: {
                title: "Put on your boots and become a winegrower for the length of a visit!",
                body: `A walk through our plots to discover the vine through the seasons, understand what we do and see the terroir with new eyes.

Then four wines to taste, to find in the glass what we have just discovered among the vines.

**From soil to glass, step into the world of Garanches.**`,
                alt: "The rows of vines at Garanches, lined with a grassy path",
            },
            "comment-ca-se-passe": {
                title: "How does it work?",
                pratique: [
                    { label: "Duration", value: A_PRECISER },
                    { label: "Guests", value: A_PRECISER },
                    { label: "Rates", value: A_PRECISER },
                    ACCES,
                ],
                bouton: "Book",
                alt: "A glass of Brouilly served among the Garanches vines",
            },
        },
    },
    "rencontrons-garanches/experiences-privees": {
        label: "Private experiences",
        description: "Family, friends, clubs, teams: private moments at Garanches, for up to about twenty people.",
        cta: "Plan an experience",
        blocs: {
            introduction: {
                title: "Let's get together differently!",
                body: `At Garanches, we welcome small groups of up to about twenty people to share a moment that suits them.

A club meeting, a team get-together, an evening with friends…

Around a table, among the vines or at the heart of the estate, we plan together a simple, friendly and lively moment.

**A place to get together, talk and take your time.**`,
                alt: "A group welcomed in the courtyard of the Garanches estate",
            },
            "comment-ca-se-passe": {
                title: "Why not take the time to get together?",
                body: `At Garanches, we create private moments for small groups of up to about twenty people.

A meal, a few bottles, a walk through the vines, a visit to the cellar…

Together we choose what will give the moment its character.

**A place to share, a moment to remember.**`,
                pratique: [
                    { label: "Duration", value: "Planned together" },
                    { label: "Guests", value: "Up to about twenty" },
                    { label: "Rates", value: "On request" },
                    ACCES,
                ],
                bouton: "Contact us",
            },
        },
    },
    "rencontrons-garanches/evenements": {
        label: "Events",
        description: "Meals and gatherings at the Garanches estate, throughout the year.",
        cta: "Discover the events",
        blocs: {
            introduction: {
                title: "Your events at Garanches",
                body: `**Some moments deserve a place of their own.**

Bringing a team together, celebrating a success, marking a birthday or simply enjoying being together...

At Garanches, every occasion takes on a special dimension.

Around a meal created by Romain and the estate's wines, we create with you a moment that is truly yours.

We get together, we talk, we celebrate... and leave with memories that last.

**At Garanches, shared moments become unforgettable memories.**`,
                alt: "A Beaujolais-Villages blanc and a Brouilly from the Garanches estate on the table",
            },
            "comment-ca-se-passe": {
                title: "How does it work?",
                pratique: [
                    { label: "Dates", value: A_PRECISER },
                    { label: "Guests", value: A_PRECISER },
                    { label: "Rates", value: A_PRECISER },
                    ACCES,
                ],
                bouton: "Book",
            },
        },
    },

    // ─────────────── ACROSS THE SITE ───────────────
    acheter: {
        label: "Buy / Find Garanches",
        description: "Order the wines of Garanches from the estate, or find them at wine shops and restaurants.",
        cta: "Find Garanches",
        blocs: {
            commander: {
                title: "Order",
                body: `**1. Choose your wines** from our cuvées.

**2. Send us your order** with the button below, or call us. We reply within 24 hours.
**Isabelle: +33 6 61 73 56 67**
**Aurélie: +33 6 58 83 46 80**
Romain: +33 7 82 24 94 36
Michel: +33 6 09 41 97 02

**3. Collection or delivery**: we confirm your order, then ship it from our cellar in Odenas anywhere in France, or prepare it for you to collect at the estate.

There is no online payment. For large quantities, ask us for a quote.`,
                alt: "A bottle of Brouilly from the Garanches estate",
                bouton: "Place an order",
            },
            "restaurants-cavistes": { title: "Restaurants and wine shops" },
            professionnels: {
                title: "Trade",
                body: `Restaurants, wine shops, companies: write to us to receive our trade prices and arrange a tasting.`,
                bouton: "Contact us",
            },
        },
    },
};

export const CARNETS_CARD_EN = {
    label: "The Garanches Notebooks",
    description: "Stories of vines, wines, gatherings and the people who keep Garanches alive.",
    cta: "Read the Notebooks",
};

export const CARNETS_MENU_EN = "The Notebooks";

export const CARNETS_INTRO_EN = {
    title: "Open the notebook.",
    body: `Garanches also tells its story day by day.
A vine, a season, a wine, a gathering, a story.
The Notebooks are our way of keeping a trace of these moments and sharing them with you.

Stories of vines, wines, gatherings and the people who keep Garanches alive.
A look at what happens here, season after season.`,
};

export const CARNET_THEMES_EN: Record<string, string> = {
    vigne: "The vine",
    vins: "The wines",
    lieu: "The place",
    histoire: "History",
    rencontres: "Gatherings",
};

// Mots-clés sous chaque page dans les menus.
export const MOTS_CLES_EN: Record<string, string> = {
    "le-lieu/le-domaine": "Odenas • landscape • granite",
    "le-lieu/histoire": "Bender • Jean Buy • archives",
    "le-lieu/traces": "Old vines • documents",
    "le-lieu/ceux-qui-le-font-vivre": "People • craft • passing on",
    carnets: "Stories • archives • seasons",
    "les-vins/notre-facon-de-faire": "Soil • seasons • vintages",
    "les-vins/cuvees": "Plots • blends",
    "les-vins/terroirs": "Soils • granite • plots",
    "les-vins/a-table": "Dishes • pairings • moments",
    "rencontrons-garanches/les-rencontres": "Shared tables • conversations",
    "rencontrons-garanches/deguster-au-domaine": "The cellar • the wines",
    "rencontrons-garanches/decouvrir-les-vignes": "Walk • seasons",
    "rencontrons-garanches/experiences-privees": "Family • friends • groups",
    "rencontrons-garanches/evenements": "Meals • gatherings",
};

export const SIGNATURE_EN = "A place. Wines. A story to live.";

// Liens sous les trois portes de l'accueil.
export const HOME_PORTES_EN: Record<string, { label: string; motsCles: string }[]> = {
    "le-lieu": [
        { label: "The estate", motsCles: "Odenas • landscape • granite • vines" },
        { label: "The history", motsCles: "Bender • Jean Buy • archives • traces" },
    ],
    "les-vins": [
        { label: "Our approach", motsCles: "Soil • seasons • vintages • time" },
        { label: "Our cuvées", motsCles: "Terroirs • blends • at the table" },
    ],
    "rencontrons-garanches": [
        { label: "Shared tables", motsCles: "Shared tables • wines • conversations" },
        { label: "Experiences", motsCles: "Tastings • vineyard • private • events" },
    ],
};
