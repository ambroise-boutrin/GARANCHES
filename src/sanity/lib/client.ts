import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, studioUrl, useCdn } from '../env';

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    // Marques invisibles dans les textes, activées seulement dans l'aperçu du studio :
    // elles permettent de cliquer sur un texte de la page pour ouvrir le bon champ.
    stega: { enabled: false, studioUrl },
});
