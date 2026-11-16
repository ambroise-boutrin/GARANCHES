import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { BLOCS_DU_SITE } from '@/data/architecture';
import { PAGES_EN } from '@/i18n/en/architecture';

// Mise à jour ponctuelle : durées, personnes et tarifs des Rencontres dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '00b11630059f65bde008b8d6b1361c5ad4f4ab1159fca9559b7be187e2a42dd7';
const CLES = [
    'rencontrons-garanches/les-rencontres#comment-ca-se-passe',
    'rencontrons-garanches/deguster-au-domaine#comment-ca-se-passe',
    'rencontrons-garanches/decouvrir-les-vignes#comment-ca-se-passe',
];

function autorise(code: string | null) {
    if (!code) return false;
    const a = createHash('sha256').update(code).digest();
    const b = Buffer.from(EMPREINTE, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
}

const avecCles = (l: { label: string; value: string }[]) => l.map((p) => ({ _key: randomUUID().slice(0, 12), label: p.label, value: p.value }));

export async function POST(request: Request) {
    if (!autorise(request.headers.get('x-code-import'))) return new Response('Non autorisé', { status: 401 });
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return Response.json({ erreur: 'SANITY_API_WRITE_TOKEN absent' }, { status: 503 });
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    const r: Record<string, unknown> = {};
    for (const cle of CLES) {
        const fr = BLOCS_DU_SITE.find((b) => b.cle === cle)?.bloc.pratique;
        const [page, id] = cle.split('#');
        const en = PAGES_EN[page]?.blocs?.[id]?.pratique;
        if (!fr || !en) { r[cle] = 'introuvable dans le code'; continue; }
        const docs = await client.fetch<{ _id: string; pratique?: unknown; pratiqueEn?: unknown }[]>('*[_type == "bloc" && cle == $cle]{ _id, pratique, pratiqueEn }', { cle });
        if (!docs.length) { r[cle] = 'aucun bloc dans Sanity (le code s’affiche)'; continue; }
        for (const d of docs) {
            await client.patch(d._id).set({ pratique: avecCles(fr), pratiqueEn: avecCles(en) }).commit();
            r[d._id] = { avant: { pratique: d.pratique, pratiqueEn: d.pratiqueEn }, apres: 'mis à jour' };
        }
    }
    return Response.json({ ok: true, r });
}
