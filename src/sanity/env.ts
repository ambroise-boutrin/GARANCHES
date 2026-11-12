export const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-13'

export const dataset = assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const useCdn = false

function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined) {
        throw new Error(errorMessage)
    }
    return v
}

// Jeton qui sert seulement, côté serveur, à l'aperçu des brouillons dans le mode visuel du studio.
// SANITY_API_READ_TOKEN (jeton « Viewer ») s'il existe, sinon le jeton déjà en place pour les statistiques d'âge.
export const readToken = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || ''

export const studioUrl = '/studio'
