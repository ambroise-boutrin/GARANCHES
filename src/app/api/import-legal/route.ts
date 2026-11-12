import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { PAGES_LEGALES } from '@/sanity/schemas/pageLegale';

// Import ponctuel des pages légales dans Sanity (texte déjà converti). Protégé par un code à usage unique ; route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = 'da78d2ae36e37169b140f55f4128124ac65a664ba4b5a9624044bb25914be70c';

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
    const docs = (await request.json()) as any[];
    const journal: string[] = [];
    for (const d of docs) {
        if (d?._type !== 'pageLegale' || !PAGES_LEGALES.some((p) => p.value === d.page) || d._id !== `legal-${d.page}`) continue;
        const deja = await client.fetch<number>('count(*[_type == "pageLegale" && page == $page])', { page: d.page });
        if (deja) { journal.push(`Déjà présente : ${d.titre}`); continue; }
        await client.createIfNotExists(d);
        journal.push(`Ajoutée : ${d.titre}`);
    }
    return Response.json({ ok: true, journal });
}
