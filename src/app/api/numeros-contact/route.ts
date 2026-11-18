import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Mise à jour ponctuelle : seuls les numéros d'Isabelle et d'Aurélie restent dans Sanity
// (liste des téléphones, textes des pages, pages légales). Route retirée après usage.
// Sans ?ecrire=1, la route liste seulement ce qui serait changé.
export const dynamic = 'force-dynamic';

const EMPREINTE = '31ca9d5aa6e13253b9885efa477441efa5cf34093e534b55efddadeed6133352';

const RETIRES = /romain|michel/i;
const NUMEROS = /(7[\s\u00a0.]*82[\s\u00a0.]*24[\s\u00a0.]*94[\s\u00a0.]*36|6[\s\u00a0.]*09[\s\u00a0.]*41[\s\u00a0.]*97[\s\u00a0.]*02|782249436|609419702)/;
// Lignes « Romain : 07 82 24 94 36 » (avec ou sans gras), en français et en anglais.
const LIGNE = /\n?[ \t]*\**[ \t]*(Romain|Michel)[ \t\u00a0\u202f]*:[ \t\u00a0\u202f]*[+\d][\d \u00a0.]*\d[ \t]*\**[ \t]*(?=\n|$)/g;
// « · +33 7 82 24 94 36 (Romain) » dans un texte suivi.
const SUITE = /[ \u00a0]*[·,][ \u00a0]*[+\d][\d \u00a0.]*\d[ \u00a0]*\((Romain|Michel)\)/g;

function autorise(code: string | null) {
    if (!code) return false;
    const a = createHash('sha256').update(code).digest();
    const b = Buffer.from(EMPREINTE, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
}

function corriger(v: unknown, chemin: string, traces: string[], restes: unknown[]): unknown {
    if (typeof v === 'string') {
        const s = v.replace(LIGNE, '').replace(SUITE, '');
        if (s !== v) traces.push(chemin);
        if (NUMEROS.test(s)) restes.push({ chemin, texte: s });
        return s;
    }
    if (Array.isArray(v)) {
        // Liste des téléphones : on retire les entrées de Romain et Michel.
        const garde = v.filter((x) => !(x && typeof x === 'object' && (x as any)._type === 'numero' && RETIRES.test(String((x as any).nom ?? ''))));
        if (garde.length !== v.length) traces.push(`${chemin}: ${v.length - garde.length} numéro(s) retiré(s)`);
        return garde.map((x, i) => {
            // Bloc de texte riche contenant encore un des numéros : renvoyé tel quel pour examen.
            if (x && typeof x === 'object' && Array.isArray((x as any).children)) {
                const t = (x as any).children.map((c: any) => c?.text ?? '').join('');
                if (NUMEROS.test(t)) restes.push({ chemin: `${chemin}[${i}]`, bloc: x });
            }
            return corriger(x, `${chemin}[${i}]`, traces, []);
        });
    }
    if (v && typeof v === 'object') {
        const o: Record<string, unknown> = {};
        for (const [k, x] of Object.entries(v)) o[k] = k.startsWith('_') ? x : corriger(x, `${chemin}.${k}`, traces, restes);
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
        const restes: unknown[] = [];
        for (const [k, v] of Object.entries(d)) {
            if (k.startsWith('_')) continue;
            const t: string[] = [];
            const n = corriger(v, k, t, restes);
            if (t.length) { champs[k] = n; traces.push(...t); }
        }
        if (!traces.length && !restes.length) continue;
        r[`${d._type} ${d._id}`] = { traces, restes };
        if (ecrire && traces.length) await client.patch(String(d._id)).set(champs).commit();
    }
    return Response.json({ ok: true, ecrit: ecrire, documents: docs.length, r });
}
