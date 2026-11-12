import { CARNETS_INTRO, HOME_PORTES, SIGNATURE } from "./architecture";

// Tous les petits textes et photos du site qui ne sont ni un bloc de page, ni un vin, ni un carnet.
// Chacun a une clé, un emplacement (« zone ») et sa valeur par défaut. Dans le studio, chaque zone
// (Accueil, Pied de page, Contact…) liste ses textes ; une valeur saisie là-bas remplace celle d'ici.
// Pour ajouter un texte modifiable : l'ajouter ici, puis utiliser useTexte("clé") dans le composant
// et relancer « Importer le site » dans le studio.

export const ZONES: Record<string, string> = {
    accueil: "Accueil",
    cuvees: "Vins : liste et fiches",
    contact: "Page Contact",
    "pied-de-page": "Pied de page et menu",
    carnets: "Page des Carnets",
    pages: "Mots communs à toutes les pages",
};

export type Champ = { zone: string; libelle: string; defaut: string; photo?: boolean };

const portes: Record<string, Champ> = Object.fromEntries(
    HOME_PORTES.flatMap((porte) => [
        [`accueil.porte.${porte.path}.photo`, { zone: "accueil", libelle: `Porte « ${porte.page.label} » : photo`, defaut: porte.image, photo: true }],
        ...porte.entrees.flatMap((entree, i) => [
            [`accueil.porte.${porte.path}.${i + 1}.titre`, { zone: "accueil", libelle: `Porte « ${porte.page.label} » : lien ${i + 1}`, defaut: entree.label }],
            [`accueil.porte.${porte.path}.${i + 1}.mots`, { zone: "accueil", libelle: `Porte « ${porte.page.label} » : mots-clés du lien ${i + 1}`, defaut: entree.motsCles }],
        ]),
    ])
);

export const TEXTES: Record<string, Champ> = {
    // Accueil
    "accueil.photo-haut": { zone: "accueil", libelle: "Haut de page : photo (affichée pendant le chargement de la vidéo)", defaut: "/images/garanches/video-accueil.jpg", photo: true },
    "accueil.titre": { zone: "accueil", libelle: "Haut de page : grand titre", defaut: "Domaine de\nGaranches" },
    "accueil.lieu": { zone: "accueil", libelle: "Haut de page : sous le titre", defaut: "Odenas — Mont Brouilly" },
    "accueil.phrase": { zone: "accueil", libelle: "Haut de page : phrase", defaut: "À Odenas, au pied du Mont Brouilly, Garanches est un lieu façonné par le temps, le granit et les générations qui l'ont fait vivre." },
    "accueil.bouton-vins": { zone: "accueil", libelle: "Haut de page : bouton rouge", defaut: "Découvrir les vins" },
    "accueil.bouton-rencontre": { zone: "accueil", libelle: "Haut de page : bouton blanc", defaut: "Rencontrons-nous" },
    "accueil.signature": { zone: "accueil", libelle: "Les trois portes : titre", defaut: SIGNATURE },
    ...portes,
    "accueil.histoire.titre": { zone: "accueil", libelle: "Une histoire qui continue : titre", defaut: "Une histoire\nqui continue." },
    "accueil.histoire.texte": {
        zone: "accueil",
        libelle: "Une histoire qui continue : texte",
        defaut: `Garanches porte une histoire qui dépasse largement celle d'une propriété. Des hommes et des femmes y ont travaillé, réfléchi, transmis et parfois dû inventer pour que la vigne puisse continuer.

Ici, le granit se décline du bleu au rose, et les générations de vignes se côtoient : certaines ont près de 150 ans, d'autres n'ont que quelques années. Nous les regardons vivre au fil des saisons, avec ce qu'elles portent du passé et ce qu'elles promettent pour demain.`,
    },
    "accueil.histoire.lien": { zone: "accueil", libelle: "Une histoire qui continue : lien", defaut: "Lire l'histoire" },
    "accueil.histoire.photo": { zone: "accueil", libelle: "Une histoire qui continue : photo", defaut: "/images/23_slide002.jpg", photo: true },
    "accueil.lieu-vins.titre": { zone: "accueil", libelle: "Des vins qui viennent d'un lieu : titre", defaut: "Des vins qui viennent d'un lieu." },
    "accueil.lieu-vins.1.titre": { zone: "accueil", libelle: "Des vins qui viennent d'un lieu : carte 1, titre", defaut: "Le Gamay" },
    "accueil.lieu-vins.1.texte": { zone: "accueil", libelle: "Des vins qui viennent d'un lieu : carte 1, texte", defaut: "Le cépage du Beaujolais. Sur notre granit du Mont Brouilly, il donne des Brouilly de fruits rouges et noirs, droits et minéraux." },
    "accueil.lieu-vins.2.titre": { zone: "accueil", libelle: "Des vins qui viennent d'un lieu : carte 2, titre", defaut: "Le Chardonnay" },
    "accueil.lieu-vins.2.texte": { zone: "accueil", libelle: "Des vins qui viennent d'un lieu : carte 2, texte", defaut: "Sur quelques parcelles argilo-calcaires choisies, il donne un Bourgogne blanc floral, aux notes d'agrumes et de fleurs blanches." },
    "accueil.lieu-vins.3.titre": { zone: "accueil", libelle: "Des vins qui viennent d'un lieu : carte 3, titre", defaut: "Notre façon de faire" },
    "accueil.lieu-vins.3.texte": { zone: "accueil", libelle: "Des vins qui viennent d'un lieu : carte 3, texte", defaut: "Vignerons indépendants, certifiés HVE. Rangs enherbés, sols travaillés, vendanges à la main : nous suivons la vigne au fil des saisons." },
    "accueil.vins.titre": { zone: "accueil", libelle: "Nos vins : titre", defaut: "Nos vins" },
    "accueil.vins.texte": { zone: "accueil", libelle: "Nos vins : texte", defaut: "Des vins précis, vivants, en petites quantités. Ils partent directement de notre cave à Odenas, partout en France." },
    "accueil.vins.bouton": { zone: "accueil", libelle: "Nos vins : bouton", defaut: "Voir toutes les cuvées" },

    // Vins
    "cuvees.bouton": { zone: "cuvees", libelle: "Bouton de commande", defaut: "Demander des bouteilles" },
    "cuvees.epuise": { zone: "cuvees", libelle: "Mention quand un vin n'est plus en vente", defaut: "Épuisé" },
    "cuvees.decouvrir": { zone: "cuvees", libelle: "Liste : lien vers la fiche", defaut: "Découvrir la cuvée" },
    "cuvees.question.titre": { zone: "cuvees", libelle: "Liste : encadré du bas, titre", defaut: "Une question sur un millésime ?" },
    "cuvees.question.texte": { zone: "cuvees", libelle: "Liste : encadré du bas, texte", defaut: "N'hésitez pas à nous contacter pour connaître les tarifs d'expédition ou pour passer commande directement." },
    "cuvees.question.lien": { zone: "cuvees", libelle: "Liste : encadré du bas, lien", defaut: "Contactez-nous" },
    "cuvees.fiche.photo": { zone: "cuvees", libelle: "Fiche : photo du haut", defaut: "/images/23_slide002.jpg", photo: true },
    "cuvees.fiche.parcelle": { zone: "cuvees", libelle: "Fiche : titre « Parcelle et terroir »", defaut: "Parcelle et terroir" },
    "cuvees.fiche.vinification": { zone: "cuvees", libelle: "Fiche : titre « Assemblage et élevage »", defaut: "Assemblage et élevage" },
    "cuvees.fiche.autres": { zone: "cuvees", libelle: "Fiche : titre « Les autres cuvées »", defaut: "Les autres cuvées" },

    // Contact
    "contact.titre": { zone: "contact", libelle: "Grand titre", defaut: "Contact" },
    "contact.intro": { zone: "contact", libelle: "Phrase sous le titre", defaut: "Venir, écrire, appeler, réserver : nous sommes à votre écoute." },
    "contact.email": { zone: "contact", libelle: "Adresse e-mail qui reçoit les messages du formulaire", defaut: "contact@domainedegaranches.com" },
    "contact.coordonnees": { zone: "contact", libelle: "Encadré : titre", defaut: "Nos Coordonnées" },
    "contact.adresse": { zone: "contact", libelle: "Adresse (une ligne par retour à la ligne)", defaut: "Domaine de Garanches\n345 chemin de Garanches\n69460 Odenas\nFrance" },
    "contact.horaires": { zone: "contact", libelle: "Horaires d'ouverture", defaut: "Lundi au Samedi : 09h00 - 18h00" },
    "contact.fermeture": { zone: "contact", libelle: "Jours de fermeture", defaut: "Fermé le Dimanche et jours fériés" },
    "contact.photo": { zone: "contact", libelle: "Photo sous les coordonnées", defaut: "/images/smugmug/domaine-drone-maison.jpg", photo: true },
    "contact.formulaire": { zone: "contact", libelle: "Formulaire : titre", defaut: "Envoyez-nous un message" },
    "contact.venir.titre": { zone: "contact", libelle: "Venir à Garanches : titre", defaut: "Venir à Garanches" },
    "contact.venir.texte": { zone: "contact", libelle: "Venir à Garanches : texte", defaut: "345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly." },
    "contact.faq.titre": { zone: "contact", libelle: "Questions fréquentes : titre", defaut: "Tout savoir sur le Domaine" },

    // Carnets
    "carnets.intro.titre": { zone: "carnets", libelle: "Introduction : titre", defaut: CARNETS_INTRO.title },
    "carnets.intro.texte": { zone: "carnets", libelle: "Introduction : texte", defaut: CARNETS_INTRO.body },

    // Communs
    "pages.poursuivre": { zone: "pages", libelle: "Titre des cartes en bas d'une page", defaut: "Poursuivre" },
    "pages.decouvrir": { zone: "pages", libelle: "Titre des cartes en bas d'une grande rubrique", defaut: "Découvrir" },
    "pages.a-venir": { zone: "pages", libelle: "Texte affiché quand un bloc n'a pas encore de texte", defaut: "Texte à venir." },

    // Pied de page
    "pied.nom": { zone: "pied-de-page", libelle: "Nom du domaine", defaut: "Domaine de Garanches" },
    "pied.adresse": { zone: "pied-de-page", libelle: "Adresse", defaut: "345 chemin de Garanches\n69460 Odenas, France" },
    "pied.contact": { zone: "pied-de-page", libelle: "Lien vers le contact", defaut: "Nous contacter" },
    "pied.mention": { zone: "pied-de-page", libelle: "Mention en bas de page", defaut: "Domaine de Garanches. L'abus d'alcool est dangereux pour la santé, à consommer avec modération." },
    "menu.commander": { zone: "pied-de-page", libelle: "Menu : bouton en haut à droite", defaut: "Commander" },
};

export const PHOTOS_PAR_DEFAUT = Object.fromEntries(Object.entries(TEXTES).filter(([, c]) => c.photo).map(([k, c]) => [k, c.defaut]));
