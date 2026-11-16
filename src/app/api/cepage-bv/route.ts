import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Retrait ponctuel du cépage du Beaujolais-Villages blanc dans Sanity (à confirmer par le domaine). Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '07cf32c2b0797092752790044d2e88279d67fe169c052af1c32d0e0dd4781a56';

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
    const ids = await client.fetch<string[]>('*[_type == "wine" && slug.current == "beaujolais-villages-blanc"]._id');
    for (const id of ids) await client.patch(id).set({ tags: [] }).commit();
    return Response.json({ ok: true, ids });
}
