// Types partagés entre le serveur et le navigateur (sans dépendance au serveur).
// Photo prête à afficher : adresse, cadrage, aperçu flou, et attribut pour la cliquer dans le mode visuel.
export type PhotoPrete = { src: string; position?: string; blur?: string; cliquer?: string };

export type InfosPage = {
    titre?: string;
    motsCles?: string;
    description?: string;
    bouton?: string;
    seoTitre?: string;
    seoDescription?: string;
    photo?: PhotoPrete;
};

// Tout ce qui est partagé par les pages : envoyé une fois au navigateur (menus, pied de page, accueil, contact).
export type ContenuSite = {
    textes: Record<string, string>;
    photos: Record<string, PhotoPrete>;
    pages: Record<string, InfosPage>;
    telephones: { nom: string; numero: string }[] | null;
    faq: { question: string; reponse: string }[] | null;
};

export const CONTENU_VIDE: ContenuSite = { textes: {}, photos: {}, pages: {}, telephones: null, faq: null };

