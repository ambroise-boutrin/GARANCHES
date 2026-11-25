import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { pagesDe } from '@/data/architecture';

// Mise à jour ponctuelle : titre et texte du diplôme de Mâcon sur Traces (route retirée après usage).
export const dynamic = 'force-dynamic';
const EMPREINTE = '7883c74854b53f10e46737083bd23e92bc1b7a997d2786458d319e491c5b3b9c';
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
    const doc = await client.fetch<any>('*[_type == "bloc" && cle == "le-lieu/traces#documents"][0]{ _id, titre, texte, titreEn, texteEn }');
    const fr = pagesDe('fr')['le-lieu/traces'].blocs.find((b) => b.id === 'documents')!;
    const en = pagesDe('en')['le-lieu/traces'].blocs.find((b) => b.id === 'documents')!;
    if (ecrire && doc) await client.patch(doc._id).set({ titre: fr.title, texte: fr.body, titreEn: en.title, texteEn: en.body }).commit();
    return Response.json({ ok: true, ecrit: ecrire, doc });
}
