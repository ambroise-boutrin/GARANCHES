import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Allègement ponctuel des mentions légales dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = 'fc6a0483e8593d225610a42da9a5849005d055a65c611da32f455ff1a6088aa4';
const IDS = ['legal-mentions-legales', 'drafts.legal-mentions-legales'];

function autorise(code: string | null) {
    if (!code) return false;
    const a = createHash('sha256').update(code).digest();
    const b = Buffer.from(EMPREINTE, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
}

function client() {
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return null;
    return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

export async function GET(request: Request) {
    if (!autorise(request.headers.get('x-code-import'))) return new Response('Non autorisé', { status: 401 });
    const c = client();
    if (!c) return Response.json({ erreur: 'SANITY_API_WRITE_TOKEN absent' }, { status: 503 });
    const docs = await c.fetch('*[_id in $ids]{ _id, _rev, titre, contenu }', { ids: IDS });
    return Response.json(docs);
}

// Remplace le contenu du document publié (et du brouillon s'il existe) par celui envoyé,
// seulement si la révision n'a pas changé depuis la lecture.
export async function POST(request: Request) {
    if (!autorise(request.headers.get('x-code-import'))) return new Response('Non autorisé', { status: 401 });
    const c = client();
    if (!c) return Response.json({ erreur: 'SANITY_API_WRITE_TOKEN absent' }, { status: 503 });
    const { id, rev, contenu } = await request.json();
    if (!IDS.includes(id) || !Array.isArray(contenu)) return new Response('Requête invalide', { status: 400 });
    const res = await c.patch(id).ifRevisionId(rev).set({ contenu }).commit();
    return Response.json({ ok: true, id: res._id, rev: res._rev });
}
