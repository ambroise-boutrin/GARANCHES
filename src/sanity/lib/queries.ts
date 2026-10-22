import { client } from './client';

export async function getWines() {
    return await client.fetch(`*[_type == "wine"] {
    _id,
    "id": _id,
    "slug": slug.current,
    name,
    subtitle,
    price,
    description,
    "image": image.asset->url,
    tags,
    alcohol,
    volume,
    allergens,
    parcelle,
    vinification
  }`);
}

export async function getPageContent(page: string) {
    let content = [];
    try {
        content = await client.fetch(
            `*[_type == "pageContent" && page == $page]{ ..., "videoUrl": video.asset->url }`,
            { page }
        );
    } catch (error) {
        console.error('Sanity: contenu de page indisponible', error);
    }

    // Convert array of sections into a key-value object for easier use
    return content.reduce((acc: any, item: any) => {
        acc[item.section] = {
            title: item.title,
            content: item.content,
            image: item.image,
            videoUrl: item.videoUrl
        };
        return acc;
    }, {});
}

export type BlocOverride = { titre?: string; texte?: string; image?: any; bouton?: string; pratique?: { label: string; value: string }[] };

// Blocs de texte modifiés dans le studio, indexés par clé « chemin#bloc ».
// En cas d'erreur Sanity, le site affiche les textes par défaut.
export async function getBlocs(): Promise<Record<string, BlocOverride>> {
    try {
        const blocs = await client.fetch(`*[_type == "bloc" && defined(cle)]{ cle, titre, texte, image, bouton, pratique }`);
        return Object.fromEntries(blocs.map((b: any) => [b.cle, b]));
    } catch (error) {
        console.error('Sanity: blocs indisponibles', error);
        return {};
    }
}

const CARNET_FIELDS = `titre, "slug": slug.current, date, theme, image, extrait`;

export async function getCarnets(limit?: number) {
    try {
        const range = limit ? `[0...${limit}]` : '';
        return await client.fetch(
            `*[_type == "carnet" && defined(slug.current)] | order(date desc) ${range} { ${CARNET_FIELDS} }`
        );
    } catch (error) {
        console.error('Sanity: carnets indisponibles', error);
        return [];
    }
}

export async function getCarnet(slug: string) {
    try {
        return await client.fetch(
            `*[_type == "carnet" && slug.current == $slug][0]{ ${CARNET_FIELDS}, contenu }`,
            { slug }
        );
    } catch (error) {
        console.error('Sanity: carnet indisponible', error);
        return null;
    }
}
