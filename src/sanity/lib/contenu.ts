import { cache } from 'react';
import { stegaClean } from 'next-sanity';
import { cliquable, sanityFetch } from './fetch';
import { photoSanity } from './photo';

import type { ContenuSite, InfosPage, PhotoPrete } from './contenuTypes';
import { CONTENU_VIDE } from './contenuTypes';

export type { ContenuSite, InfosPage, PhotoPrete };

const PHOTO = `{ ..., "lqip": asset->metadata.lqip }`;

function prete(photo: any, largeur: number, cliquer?: string): PhotoPrete | undefined {
    const p = photoSanity(photo, largeur);
    return p ? { src: p.src, ...(p.position && { position: p.position }), ...(p.blur && { blur: p.blur }), ...(cliquer && { cliquer }) } : undefined;
}

// Une seule lecture Sanity par page affichée (mise en cache pendant le rendu).
export const getContenuSite = cache(async (): Promise<ContenuSite> => {
    try {
        const r = await sanityFetch<any>(`{
            "zones": *[_type == "zone"]{ _id, entrees[]{ _key, cle, texte, "photo": photo${PHOTO} } },
            "pages": *[_type == "bandeau" && defined(page)]{ _id, page, titre, motsCles, description, bouton, seoTitre, seoDescription, "image": image${PHOTO} },
            "telephones": *[_type == "telephones"][0].numeros[]{ nom, numero },
            "faq": *[_type == "faq"][0].questions[]{ question, reponse }
        }`);

        const textes: ContenuSite['textes'] = {};
        const photos: ContenuSite['photos'] = {};
        for (const zone of r.zones ?? []) {
            for (const e of zone.entrees ?? []) {
                const cle = stegaClean(e.cle);
                if (!cle) continue;
                if (typeof e.texte === 'string' && stegaClean(e.texte).trim()) textes[cle] = e.texte;
                const photo = prete(e.photo, 2000, cliquable(zone._id, 'zone', `entrees[_key=="${e._key}"].photo`));
                if (photo) photos[cle] = photo;
            }
        }

        const pages: ContenuSite['pages'] = {};
        for (const p of r.pages ?? []) {
            const infos: InfosPage = {};
            for (const champ of ['titre', 'motsCles', 'description', 'bouton', 'seoTitre', 'seoDescription'] as const) {
                if (typeof p[champ] === 'string' && stegaClean(p[champ]).trim()) infos[champ] = p[champ];
            }
            const photo = prete(p.image, 2400, cliquable(p._id, 'bandeau', 'image'));
            if (photo) infos.photo = photo;
            pages[stegaClean(p.page)] = infos;
        }

        const telephones = (r.telephones ?? []).filter((t: any) => t?.nom && t?.numero).map((t: any) => ({ nom: t.nom, numero: stegaClean(t.numero) }));
        const faq = (r.faq ?? []).filter((f: any) => f?.question && f?.reponse);

        return { textes, photos, pages, telephones: telephones.length ? telephones : null, faq: faq.length ? faq : null };
    } catch (error) {
        console.error('Sanity: contenu du site indisponible', error);
        return CONTENU_VIDE;
    }
});

// Équipe (page « Ceux qui le font vivre »).
export async function getEquipe(): Promise<{ nom: string; photo?: PhotoPrete }[] | null> {
    try {
        const doc = await sanityFetch<any>(`*[_type == "equipe"][0]{ _id, membres[]{ _key, nom, "photo": photo${PHOTO} } }`);
        const membres = (doc?.membres ?? []).filter((m: any) => m?.nom);
        if (!membres.length) return null;
        return membres.map((m: any) => ({ nom: m.nom, photo: prete(m.photo, 900, cliquable(doc._id, 'equipe', `membres[_key=="${m._key}"].photo`)) }));
    } catch (error) {
        console.error('Sanity: équipe indisponible', error);
        return null;
    }
}

// Page légale (mentions, CGV, confidentialité) : null tant qu'elle n'est pas dans le studio.
export async function getPageLegale(page: string): Promise<{ titre: string; contenu: any[] } | null> {
    try {
        const doc = await sanityFetch<any>(`*[_type == "pageLegale" && page == $page][0]{ titre, contenu }`, { page });
        return doc?.titre && doc?.contenu?.length ? doc : null;
    } catch (error) {
        console.error('Sanity: page légale indisponible', error);
        return null;
    }
}
