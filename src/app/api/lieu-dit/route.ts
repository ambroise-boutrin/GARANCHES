import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Ajout ponctuel de la mention « Lieu-dit Garanches » au sous-titre des Brouilly dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '9a7e14d71174ffac1ea4ab11d41465aece082a11a927c11dc379ca46240c2d8d';

function autorise(code: string | null) {
    if (!code) return false;
    const a = createHash('sha256').update(code).digest();
    const b = Buffer.from(EMPREINTE, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
}

const ajoute = (s: unknown) => {
    const t = String(s || '').trim();
    if (!t || /lieu-dit/i.test(t)) return t;
    return `${t} — Lieu-dit Garanches`;
};

export async function POST(request: Request) {
    if (!autorise(request.headers.get('x-code-import'))) return new Response('Non autorisé', { status: 401 });
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return Response.json({ erreur: 'SANITY_API_WRITE_TOKEN absent' }, { status: 503 });
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    const docs = await client.fetch<{ _id: string; subtitle?: string; subtitleEn?: string }[]>(
        '*[_type == "wine" && slug.current in ["brouilly", "brouilly-2024", "brouilly-2025"]]{_id, subtitle, subtitleEn}'
    );
    const faits = [];
    for (const d of docs) {
        const set: Record<string, string> = { subtitle: ajoute(d.subtitle) || 'Cru du Beaujolais — Rouge — Lieu-dit Garanches' };
        if (d.subtitleEn) set.subtitleEn = ajoute(d.subtitleEn);
        await client.patch(d._id).set(set).commit();
        faits.push({ id: d._id, avant: d.subtitle, avantEn: d.subtitleEn, apres: set });
    }
    return Response.json({ ok: true, faits });
}
