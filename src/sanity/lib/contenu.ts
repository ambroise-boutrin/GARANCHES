import { cache } from 'react';
import { stegaClean } from 'next-sanity';
import { cliquable, sanityFetch } from './fetch';
import { photoSanity } from './photo';
import { langueCourante } from '@/lib/langueServeur';

import type { ContenuSite, InfosPage, PhotoPrete } from './contenuTypes';
import { CONTENU_VIDE } from './contenuTypes';

export type { ContenuSite, InfosPage, PhotoPrete };

const PHOTO = `{ ..., "lqip": asset->metadata.lqip }`;

function prete(photo: any, largeur: number, cliquer?: string): PhotoPrete | undefined {
    const p = photoSanity(photo, largeur);
    return p ? { src: p.src, ...(p.position && { position: p.position }), ...(p.blur && { blur: p.blur }), ...(cliquer && { cliquer }) } : undefined;
}

// Une seule lecture Sanity par page affichée (mise en cache pendant le rendu).
// En anglais, on lit les champs « … en anglais » du studio (texteEn, titreEn…) à la place des champs français ;
// un champ anglais vide laisse la traduction prévue dans le code (src/i18n/en).
export const getContenuSite = (): Promise<ContenuSite> => contenuDansLaLangue(langueCourante());

const contenuDansLaLangue = cache(async (langue: 'fr' | 'en'): Promise<ContenuSite> => {
    const en = langue === 'en';
    const champ = (nom: string) => (en ? `"${nom}": ${nom}En` : nom);
    try {
        const r = await sanityFetch<any>(`{
            "zones": *[_type == "zone"]{ _id, entrees[]{ _key, cle, ${champ('texte')}, "photo": photo${PHOTO} } },
            "pages": *[_type == "bandeau" && defined(page)]{ _id, page, ${['titre', 'motsCles', 'description', 'bouton', 'seoTitre', 'seoDescription'].map(champ).join(', ')}, "image": image${PHOTO} },
            "telephones": *[_type == "telephones"][0].numeros[]{ nom, numero },
            "faq": *[_type == "faq"][0].questions[]{ ${champ('question')}, ${champ('reponse')} }
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

        return { langue, textes, photos, pages, telephones: telephones.length ? telephones : null, faq: faq.length ? faq : null };
    } catch (error) {
        console.error('Sanity: contenu du site indisponible', error);
        return { ...CONTENU_VIDE, langue };
    }
});

// Équipe (page « Ceux qui le font vivre »).
export async function getEquipe(): Promise<{ nom: string; role?: string; photo?: PhotoPrete }[] | null> {
    try {
        const en = langueCourante() === 'en';
        const doc = await sanityFetch<any>(`*[_type == "equipe"][0]{ _id, membres[]{ _key, nom, ${en ? '"role": roleEn' : 'role'}, "photo": photo${PHOTO} } }`);
        const membres = (doc?.membres ?? []).filter((m: any) => m?.nom);
        if (!membres.length) return null;
        return membres.map((m: any) => ({
            nom: m.nom,
            ...(typeof m.role === 'string' && stegaClean(m.role).trim() && { role: m.role }),
            photo: prete(m.photo, 900, cliquable(doc._id, 'equipe', `membres[_key=="${m._key}"].photo`)),
        }));
    } catch (error) {
        console.error('Sanity: équipe indisponible', error);
        return null;
    }
}

// Page légale (mentions, CGV, confidentialité) : null tant qu'elle n'est pas dans le studio.
// En anglais : les champs « en anglais » de la page, sinon null (la traduction du code s'affiche).
export async function getPageLegale(page: string): Promise<{ titre: string; contenu: any[] } | null> {
    try {
        const en = langueCourante() === 'en';
        const doc = await sanityFetch<any>(`*[_type == "pageLegale" && page == $page][0]{ ${en ? '"titre": titreEn, "contenu": contenuEn' : 'titre, contenu'} }`, { page });
        return doc?.titre && doc?.contenu?.length ? doc : null;
    } catch (error) {
        console.error('Sanity: page légale indisponible', error);
        return null;
    }
}
