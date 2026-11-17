import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Mise à jour ponctuelle : mêmes corrections de texte dans Sanity que dans le code
// (incohérences relevées par le test du 17 novembre, carte « À table », horaires). Route retirée après usage.
// Sans ?ecrire=1, la route liste seulement ce qui serait changé.
export const dynamic = 'force-dynamic';

const EMPREINTE = '446a8d3cb8cc9ec791b21f38be77c96fe6970d050619fb31c7c84d37dbf713b7';

const E = '[\\s\\u00a0\\u202f]*'; // espace, insécable ou fine (ou aucune)
const R: [RegExp, string][] = [
    [/permettent de le déguster dans sa jeunesse/g, "permettent de l'apprécier dès sa jeunesse"],
    [/make it enjoyable young/g, 'make it enjoyable from its youth'],
    [/Un millésime équilibré, qui donne au vin des notes de fruits exotiques proches de notre Bourgogne 2023\./g, 'Un millésime solaire, qui donne au vin des notes de fruits exotiques.'],
    [/A balanced vintage that gives the wine notes of exotic fruit, close to our 2023 Bourgogne\./g, 'A sun-drenched vintage that gives the wine notes of exotic fruit.'],
    [/floral, fruité et acidulé, dû à la fraîcheur du millésime\./g, 'floral, fruité et acidulé.'],
    [/floral, fruity and tangy, thanks to the freshness of the vintage\./g, 'floral, fruity and tangy.'],
    [/Puis quatre vins à goûter/g, 'Puis une dégustation de nos vins'],
    [/puis quatre vins à goûter/g, 'puis une dégustation de nos vins'],
    [/Then four wines to taste/g, 'Then a tasting of our wines'],
    [/followed by four wines to taste/g, 'followed by a tasting of our wines'],
    [/Mâcon 1968/g, 'Mâcon 1988'],
    [/Plats, accords et moments de dégustation/g, 'Plats et moments de dégustation'],
    [/Dishes, pairings and tasting moments/g, 'Dishes and tasting moments'],
    [/Plats • accords • moments/g, 'Plats • moments'],
    [/Dishes • pairings • moments/g, 'Dishes • moments'],
    [/Accords mets et vins du Beaujolais/g, 'À table avec les vins de Garanches'],
    [/Beaujolais food and wine pairings/g, 'At the table with the wines of Garanches'],
    [new RegExp(`Une question sur un millésime${E}\\?`, 'g'), 'Une question, une commande ?'],
    [/A question about a vintage\?/g, 'A question or an order?'],
    [new RegExp(`Lundi au Samedi${E}:${E}09h00${E}-${E}18h00`, 'g'), 'Du lundi au samedi, de 9h à 18h'],
    [/Fermé le Dimanche et jours fériés/g, 'Fermé le dimanche et les jours fériés'],
];

function autorise(code: string | null) {
    if (!code) return false;
    const a = createHash('sha256').update(code).digest();
    const b = Buffer.from(EMPREINTE, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
}

// Remplace dans toutes les chaînes d'une valeur (sauf les champs techniques « _… »).
function corriger(v: unknown, traces: string[]): unknown {
    if (typeof v === 'string') {
        let s = v;
        for (const [re, par] of R) {
            re.lastIndex = 0;
            if (re.test(s)) { traces.push(`${re.source} → ${par}`); re.lastIndex = 0; s = s.replace(re, par); }
        }
        return s;
    }
    if (Array.isArray(v)) return v.map((x) => corriger(x, traces));
    if (v && typeof v === 'object') {
        const o: Record<string, unknown> = {};
        for (const [k, x] of Object.entries(v)) o[k] = k.startsWith('_') ? x : corriger(x, traces);
        return o;
    }
    return v;
}

export async function POST(request: Request) {
    if (!autorise(request.headers.get('x-code-import'))) return new Response('Non autorisé', { status: 401 });
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return Response.json({ erreur: 'SANITY_API_WRITE_TOKEN absent' }, { status: 503 });
    const ecrire = new URL(request.url).searchParams.get('ecrire') === '1';
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: 'raw' });
    const docs = await client.fetch<Record<string, unknown>[]>('*[!(_type match "system.*") && !(_type match "sanity.*")]');
    const r: Record<string, unknown> = {};
    for (const d of docs) {
        const champs: Record<string, unknown> = {};
        const traces: string[] = [];
        for (const [k, v] of Object.entries(d)) {
            if (k.startsWith('_')) continue;
            const t: string[] = [];
            const n = corriger(v, t);
            if (t.length) { champs[k] = n; traces.push(...t.map((x) => `${k}: ${x}`)); }
        }
        if (!traces.length) continue;
        r[`${d._type} ${d._id}`] = traces;
        if (ecrire) await client.patch(String(d._id)).set(champs).commit();
    }
    return Response.json({ ok: true, ecrit: ecrire, documents: docs.length, r });
}
