import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Envoi ponctuel dans Sanity de la vraie photo du Brouilly 2024. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '6039a29603cf92a15863d4f2e5198deb65fa0126632d45b20e17a9e90702db03';

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
    const vin = await client.fetch<any>('*[_type == "wine" && slug.current == "brouilly-2024" && !(_id in path("drafts.**"))][0]{ _id }');
    if (!vin) return Response.json({ erreur: 'brouilly-2024 introuvable' }, { status: 404 });
    const fichier = await fetch(new URL('/images/bouteilles/brouilly-2024.jpg', request.url));
    if (!fichier.ok) return Response.json({ erreur: 'photo introuvable' }, { status: 404 });
    const asset = await client.assets.upload('image', Buffer.from(await fichier.arrayBuffer()), { filename: 'brouilly-2024.jpg' });
    const image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    await client.patch(vin._id).set({ image }).commit();
    const brouillon = `drafts.${vin._id}`;
    const avecBrouillon = await client.fetch<number>('count(*[_id == $id])', { id: brouillon });
    if (avecBrouillon) await client.patch(brouillon).set({ image }).commit();
    return Response.json({ ok: true, asset: asset._id, brouillon: Boolean(avecBrouillon) });
}
