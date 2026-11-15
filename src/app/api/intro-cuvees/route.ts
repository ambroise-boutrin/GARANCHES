import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Mise à jour ponctuelle de l'introduction des cuvées dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '931325c3fd0cc34e56480ba1b79de7eec99ae0969fa195140ba6c0724f7f115a';
const AVANT = 'Trois vins, chacun avec son millésime : un Brouilly rouge, un Beaujolais-Villages blanc et un Bourgogne blanc.';
const APRES = 'Le Brouilly, le Beaujolais-Villages blanc et le Bourgogne blanc du domaine, présentés millésime par millésime.';

function autorise(code: string | null) {
    if (!code) return false;
    const a = createHash('sha256').update(code).digest();
    const b = Buffer.from(EMPREINTE, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
    if (!autorise(request.headers.get('x-code-import'))) return new Response('Non autorisé', { status: 401 });
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return Response.json({ erreur: 'SANITY_API_WRITE_TOKEN absent' }, { status: 503 });
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    const resultats: Record<string, string> = {};
    for (const id of ['bloc-les-vins-cuvees-introduction', 'drafts.bloc-les-vins-cuvees-introduction']) {
        const texte = await client.fetch<string | null>('*[_id == $id][0].texte', { id });
        if (texte === AVANT) {
            await client.patch(id).set({ texte: APRES }).commit();
            resultats[id] = 'corrigé';
        } else resultats[id] = texte === null ? 'absent' : `inchangé : ${texte}`;
    }
    return Response.json({ ok: true, resultats });
}
