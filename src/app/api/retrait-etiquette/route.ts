import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Retrait ponctuel du bloc « La maison sur l'étiquette » dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = 'cb4f59dfe091b696f7227716161096c4c171c57dda39a5d98782b26b680b0bb9';
const CLE = 'les-vins/cuvees#etiquette';

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
    const ids = await client.fetch<string[]>('*[_type == "bloc" && cle == $cle]._id', { cle: CLE });
    for (const id of ids) await client.delete(id);
    const intro = await client.fetch<any>('*[_type == "bloc" && cle == "les-vins/cuvees#introduction"]{ _id, titre, texte }');
    return Response.json({ ok: true, supprimes: ids, intro });
}
