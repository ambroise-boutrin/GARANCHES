// Données pour Google (JSON-LD) insérées dans une balise <script> :
// les « < » sont échappés pour qu'un texte saisi dans Sanity ne puisse jamais fermer la balise.
export function serialiserJsonLd(donnees: unknown): string {
    return JSON.stringify(donnees).replace(/</g, '\\u003c');
}
