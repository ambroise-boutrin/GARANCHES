import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Mise à jour ponctuelle : photos de L'histoire et de Traces (route retirée après usage).
export const dynamic = 'force-dynamic';
const EMPREINTE = 'fa1bab749a953d0f7318cdefa443f3071f499a5e1ff32dfcbe809d0974f9f4c8';
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
    const ecrire = new URL(request.url).searchParams.get('ecrire') === '1';
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: 'raw' });
    const docs = await client.fetch<any[]>('*[(_type == "bandeau" && page in ["le-lieu/histoire", "le-lieu/traces"]) || (_type == "bloc" && cle == "le-lieu/traces#le-musee")]{ _id, _type, "image": defined(image) }');
    const cibles = docs.filter((d) => d.image);
    if (ecrire && cibles.length) {
        const tx = client.transaction();
        for (const d of cibles) tx.patch(client.patch(d._id).unset(['image']));
        await tx.commit();
    }
    return Response.json({ ok: true, ecrit: ecrire, docs });
}
