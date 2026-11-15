import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Mise à jour ponctuelle : Isabelle et Aurélie en premier et en gras dans les textes des blocs. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = 'd6076d932321e06e05e21a48171e5677fa7fa36449b84c937e7860d94ae49971';
const AVANT = 'Romain : 07 82 24 94 36\nAurélie : 06 58 83 46 80\nIsabelle : 06 61 73 56 67\nMichel : 06 09 41 97 02';
const APRES = '**Isabelle : 06 61 73 56 67**\n**Aurélie : 06 58 83 46 80**\nRomain : 07 82 24 94 36\nMichel : 06 09 41 97 02';

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
    const docs = await client.fetch<{ _id: string; texte: string }[]>('*[_type == "bloc" && texte match "Romain"]{ _id, texte }');
    const tous = await client.fetch<{ _id: string; _type: string }[]>('*[defined(texte) && texte match "Romain"]{ _id, _type }');
    const r: Record<string, string> = {};
    for (const d of docs) {
        const t = d.texte.replace(/\r\n/g, '\n');
        if (t.includes(AVANT)) {
            await client.patch(d._id).set({ texte: t.replace(AVANT, APRES) }).commit();
            r[d._id] = 'corrigé';
        } else r[d._id] = 'inchangé : ' + t.slice(0, 400);
    }
    return Response.json({ ok: true, r, tous });
}
