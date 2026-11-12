import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Correction ponctuelle du crédit photo des mentions légales dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '789333e5930db4dde77392807373726977a7ab2540c42b3111460d5939d23145';
const AVANT = 'Photographies : Vianney Tisseau, sauf mention contraire.';
const APRES = 'Photographies : Vianney Tisseau et Domaine de Garanches.';
const CHEMIN = 'contenu[_key=="aa7af42c8103"].children[_key=="39bf67211337"].text';

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
    for (const id of ['legal-mentions-legales', 'drafts.legal-mentions-legales']) {
        const texte = await client.fetch<string | null>('*[_id == $id][0].contenu[_key == "aa7af42c8103"][0].children[_key == "39bf67211337"][0].text', { id });
        if (texte === AVANT) {
            await client.patch(id).set({ [CHEMIN]: APRES }).commit();
            resultats[id] = 'corrigé';
        } else resultats[id] = texte === null ? 'absent' : `inchangé : ${texte}`;
    }
    return Response.json({ ok: true, resultats });
}
