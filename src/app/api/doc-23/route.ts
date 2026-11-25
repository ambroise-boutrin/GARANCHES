import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { pagesDe } from '@/data/architecture';
import { TEAM } from '@/data/equipe';

// Mise à jour ponctuelle de Sanity pour le document « Modification site 23 » (route retirée après usage).
// Sans ?ecrire=1, la route montre seulement l'état actuel et ce qui serait changé.
export const dynamic = 'force-dynamic';

const EMPREINTE = '6075732b93c5ce0c1857a931e94c8a7628655be50a3ccee859883726bea41585';

function autorise(code: string | null) {
    if (!code) return false;
    const a = createHash('sha256').update(code).digest();
    const b = Buffer.from(EMPREINTE, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
}

const bloc = (path: string, id: string, langue: 'fr' | 'en') => pagesDe(langue)[path].blocs.find((b) => b.id === id)!;

export async function POST(request: Request) {
    if (!autorise(request.headers.get('x-code-import'))) return new Response('Non autorisé', { status: 401 });
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return Response.json({ erreur: 'SANITY_API_WRITE_TOKEN absent' }, { status: 503 });
    const ecrire = new URL(request.url).searchParams.get('ecrire') === '1';
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: 'raw' });

    const cles = [
        'les-vins/notre-facon-de-faire#introduction',
        'le-lieu/ceux-qui-le-font-vivre#introduction',
        'le-lieu/histoire#introduction',
        'le-lieu/histoire#personnages-cles',
        'le-lieu/histoire#emile-bender',
        'le-lieu/le-domaine#le-lieu',
    ];
    const blocs = await client.fetch<any[]>('*[_type == "bloc" && cle in $cles]{ _id, cle, titre, texte, titreEn, texteEn, "image": defined(image) }', { cles });
    const bandeaux = await client.fetch<any[]>('*[_type == "bandeau" && page in ["le-lieu/traces", "le-lieu/le-domaine", "le-lieu/histoire"]]{ _id, page, "image": defined(image) }');
    const equipe = await client.fetch<any>('*[_type == "equipe"][0]{ _id, membres[]{ _key, nom, role, roleEn } }');

    const actions: string[] = [];
    const tx = client.transaction();
    for (const b of blocs) {
        if (b.cle === 'le-lieu/le-domaine#le-lieu') { tx.delete(b._id); actions.push(`supprimer ${b._id}`); continue; }
        const [path, id] = b.cle.split('#');
        const set: Record<string, string> = {};
        const unset: string[] = [];
        if (b.cle === 'les-vins/notre-facon-de-faire#introduction') {
            const fr = bloc(path, id, 'fr'), en = bloc(path, id, 'en');
            Object.assign(set, { titre: fr.title, texte: fr.body, titreEn: en.title, texteEn: en.body });
        }
        if (b.cle === 'le-lieu/ceux-qui-le-font-vivre#introduction') {
            Object.assign(set, { texte: bloc(path, id, 'fr').body, texteEn: bloc(path, id, 'en').body });
        }
        if (['le-lieu/histoire#introduction', 'le-lieu/histoire#personnages-cles', 'le-lieu/histoire#emile-bender'].includes(b.cle) && b.image) unset.push('image');
        if (!Object.keys(set).length && !unset.length) continue;
        let p = client.patch(b._id);
        if (Object.keys(set).length) p = p.set(set);
        if (unset.length) p = p.unset(unset);
        tx.patch(p);
        actions.push(`${b._id} (${b.cle}) : ${Object.keys(set).join(', ')} ${unset.length ? 'retire ' + unset.join(', ') : ''}`);
    }
    for (const b of bandeaux) {
        if (b.page === 'le-lieu/traces' && b.image) { tx.patch(client.patch(b._id).unset(['image'])); actions.push(`${b._id} : photo du haut de Traces retirée (cuvage)`); }
    }
    if (equipe?.membres?.length) {
        const membres = equipe.membres.map((m: any) => {
            const prenom = String(m.nom ?? '').trim().split(/\s+/)[0]?.toLowerCase();
            const t = TEAM.find((x) => x.name.split(' ')[0].toLowerCase() === prenom);
            return t ? { _key: m._key, role: t.role, roleEn: t.roleEn } : null;
        }).filter(Boolean);
        let p = client.patch(equipe._id);
        for (const m of membres) p = p.set({ [`membres[_key=="${m._key}"].role`]: m.role, [`membres[_key=="${m._key}"].roleEn`]: m.roleEn });
        tx.patch(p);
        actions.push(`équipe : ${membres.length} rôle(s)`);
    }
    if (ecrire && actions.length) await tx.commit();
    return Response.json({ ok: true, ecrit: ecrire, blocs, bandeaux, equipe, actions });
}
