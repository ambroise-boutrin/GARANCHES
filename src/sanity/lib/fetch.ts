import { draftMode } from 'next/headers';
import { createDataAttribute, type QueryParams } from 'next-sanity';
import { client } from './client';
import { dataset, projectId, readToken, studioUrl } from '../env';

// Aperçu du studio actif ? (faux hors requête, par exemple pendant la construction du site)
export function apercu(): boolean {
    try {
        return draftMode().isEnabled;
    } catch {
        return false;
    }
}

// Lecture Sanity pour le site.
// - Visiteur : contenu publié, remis à jour au plus toutes les 60 secondes.
// - Mode visuel du studio : brouillons compris, sans cache, avec les marques qui rendent les textes cliquables.
export async function sanityFetch<T = any>(query: string, params: QueryParams = {}): Promise<T> {
    if (apercu() && readToken) {
        return client.fetch<T>(query, params, {
            token: readToken,
            perspective: 'previewDrafts',
            stega: true,
            useCdn: false,
            cache: 'no-store',
        });
    }
    return client.fetch<T>(query, params, { perspective: 'published', next: { revalidate: 60 } });
}

// Attribut qui rend un élément (une photo surtout) cliquable dans le mode visuel du studio.
// Rien hors aperçu : le site public reste inchangé.
export function cliquable(id: string | undefined, type: string, path: string): string | undefined {
    if (!id || !apercu()) return undefined;
    return createDataAttribute({ projectId, dataset, baseUrl: studioUrl, id, type, path }).toString();
}
