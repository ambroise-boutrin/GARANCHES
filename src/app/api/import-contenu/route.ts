import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { creerImport } from '@/sanity/import/importer';

// Import ponctuel du contenu actuel du site dans Sanity, lancé depuis le serveur
// (même travail que l'outil « Importer le site » du studio, sans les pages légales).
// Protégé par un code à usage unique ; cette route sera retirée après l'import.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const EMPREINTE = '8d20d07ab38cb45eeaad65cc136d3409c2a0ad1198c5d814652652a3c1ec8632';

function autorise(code: string | null) {
    if (!code) return false;
    const a = createHash('sha256').update(code).digest();
    const b = Buffer.from(EMPREINTE, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
    if (!autorise(request.headers.get('x-code-import'))) return new Response('Non autorisé', { status: 401 });
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return Response.json({ erreur: 'SANITY_API_WRITE_TOKEN absent sur Vercel' }, { status: 503 });

    const etape = new URL(request.url).searchParams.get('etape') || '';
    const origine = new URL(request.url).origin;
    const journal: string[] = [];
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    const { etapes } = creerImport({
        client,
        noter: (ligne) => journal.push(ligne),
        lirePhoto: async (src) => {
            const reponse = await fetch(new URL(src, origine));
            if (!reponse.ok) throw new Error(`Photo introuvable : ${src}`);
            return Buffer.from(await reponse.arrayBuffer());
        },
    });
    const lancer = etapes[etape as keyof typeof etapes];
    if (!lancer) return Response.json({ erreur: 'Étape inconnue', etapes: Object.keys(etapes) }, { status: 400 });
    try {
        await lancer();
        return Response.json({ ok: true, etape, journal });
    } catch (e: any) {
        return Response.json({ ok: false, etape, journal, erreur: e?.message || String(e) }, { status: 500 });
    }
}
