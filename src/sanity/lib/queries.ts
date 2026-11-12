import { stegaClean } from 'next-sanity';
import { cliquable, sanityFetch } from './fetch';

// Photo Sanity : la référence, le point d'intérêt choisi dans le studio et un aperçu flou.
const PHOTO = `{ ..., "lqip": asset->metadata.lqip }`;

// Prix saisi en euros dans le studio, gardé en centimes dans le site (comme la liste statique et le futur paiement).
export async function getWines() {
    const wines = await sanityFetch<any[]>(`*[_type == "wine" && afficher != false] | order(coalesce(ordre, 100) asc, name asc) {
    _id,
    "id": _id,
    "slug": slug.current,
    name,
    millesime,
    subtitle,
    "price": select(defined(prix) => round(prix * 100), defined(price) => price, null),
    "enVente": enVente != false,
    stock,
    description,
    "image": image.asset->url,
    tags,
    alcohol,
    volume,
    allergens,
    parcelle,
    vinification
  }`);
    // Les adresses et liens ne doivent pas porter les marques invisibles de l'aperçu.
    return wines.map((w) => ({
        ...w,
        id: stegaClean(w.id),
        slug: stegaClean(w.slug),
        image: stegaClean(w.image),
        cliquerImage: cliquable(w._id, 'wine', 'image'),
    }));
}

export async function getPageContent(page: string) {
    let content: any[] = [];
    try {
        content = await sanityFetch<any[]>(
            `*[_type == "pageContent" && page == $page]{ ..., "videoUrl": video.asset->url }`,
            { page }
        );
    } catch (error) {
        console.error('Sanity: contenu de page indisponible', error);
    }

    // Une entrée par section, pour un accès direct : content.hero, content.philosophy…
    return content.reduce((acc: any, item: any) => {
        acc[stegaClean(item.section)] = {
            title: item.title,
            content: item.content,
            image: item.image,
            videoUrl: stegaClean(item.videoUrl),
        };
        return acc;
    }, {});
}

export type PhotoSanity = { asset?: { _ref: string }; hotspot?: { x: number; y: number }; lqip?: string };
export type BlocOverride = { cliquerImage?: string; titre?: string; texte?: string; image?: PhotoSanity; bouton?: string; pratique?: { label: string; value: string }[] };

// Blocs de texte modifiés dans le studio, indexés par clé « chemin#bloc ».
// En cas d'erreur Sanity, le site affiche les textes par défaut.
export async function getBlocs(): Promise<Record<string, BlocOverride>> {
    try {
        const blocs = await sanityFetch<any[]>(`*[_type == "bloc" && defined(cle)]{ _id, cle, titre, texte, "image": image${PHOTO}, bouton, pratique }`);
        return Object.fromEntries(blocs.map((b) => [stegaClean(b.cle), { ...b, cliquerImage: cliquable(b._id, 'bloc', 'image') }]));
    } catch (error) {
        console.error('Sanity: blocs indisponibles', error);
        return {};
    }
}

// Photos du haut des pages changées dans le studio, indexées par chemin de page.
export type Bandeau = PhotoSanity & { cliquer?: string };

export async function getBandeaux(): Promise<Record<string, Bandeau>> {
    try {
        const bandeaux = await sanityFetch<any[]>(`*[_type == "bandeau" && defined(page) && defined(image.asset)]{ page, "image": image${PHOTO} }`);
        return Object.fromEntries(bandeaux.map((b) => [stegaClean(b.page), b.image]));
    } catch (error) {
        console.error('Sanity: bandeaux indisponibles', error);
        return {};
    }
}

const CARNET_FIELDS = `titre, "slug": slug.current, date, theme, image, extrait`;

const nettoyerCarnet = (c: any) => c && { ...c, slug: stegaClean(c.slug), date: stegaClean(c.date), theme: stegaClean(c.theme) };

export async function getCarnets(limit?: number) {
    try {
        const range = limit ? `[0...${limit}]` : '';
        const carnets = await sanityFetch<any[]>(
            `*[_type == "carnet" && defined(slug.current)] | order(date desc) ${range} { ${CARNET_FIELDS} }`
        );
        return carnets.map(nettoyerCarnet);
    } catch (error) {
        console.error('Sanity: carnets indisponibles', error);
        return [];
    }
}

export async function getCarnet(slug: string) {
    try {
        return nettoyerCarnet(await sanityFetch(
            `*[_type == "carnet" && slug.current == $slug][0]{ ${CARNET_FIELDS}, contenu }`,
            { slug }
        ));
    } catch (error) {
        console.error('Sanity: carnet indisponible', error);
        return null;
    }
}
