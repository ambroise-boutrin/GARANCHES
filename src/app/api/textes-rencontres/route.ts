import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { BLOCS_DU_SITE } from '@/data/architecture';

// Mise à jour ponctuelle : textes de la table d'hôtes et des événements dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '068059455c51494224bd8d091ea30ad3a840900d3e55d8c593ed0f9518f7c969';
const CLES = ['rencontrons-garanches/les-rencontres#esprit', 'rencontrons-garanches/evenements#introduction'];

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
    const r: Record<string, unknown> = {};
    for (const cle of CLES) {
        const bloc = BLOCS_DU_SITE.find((b) => b.cle === cle)?.bloc;
        if (!bloc?.title || !bloc.body) { r[cle] = 'introuvable dans le code'; continue; }
        const docs = await client.fetch<{ _id: string; titre?: string; texte?: string }[]>('*[_type == "bloc" && cle == $cle]{ _id, titre, texte }', { cle });
        if (!docs.length) { r[cle] = 'aucun bloc dans Sanity (le texte du code s’affiche)'; continue; }
        for (const d of docs) {
            await client.patch(d._id).set({ titre: bloc.title, texte: bloc.body }).commit();
            r[d._id] = { avant: { titre: d.titre, texte: d.texte }, apres: 'mis à jour' };
        }
    }
    return Response.json({ ok: true, r });
}
