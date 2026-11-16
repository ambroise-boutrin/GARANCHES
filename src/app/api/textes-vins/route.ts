import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { PAGES } from '@/data/architecture';
import { PAGES_EN } from '@/i18n/en/architecture';
import { idDe } from '@/sanity/import/importer';

// Mise à jour ponctuelle des textes « Terre, vignes et saisons », « Millésime et temps » et « Les terroirs » dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '51bb5344d61b6d59c6253755298264b4b2c2a95f512045d66778be10b4d9ef2a';

const BLOCS: [string, string][] = [
    ['les-vins/notre-facon-de-faire', 'terre-vignes-saisons'],
    ['les-vins/notre-facon-de-faire', 'millesime-et-temps'],
    ['les-vins/terroirs', 'introduction'],
];

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
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: 'raw' });
    const resultat: any[] = [];
    for (const [path, id] of BLOCS) {
        const cle = `${path}#${id}`;
        const fr = PAGES[path].blocs.find((b) => b.id === id)!;
        const en = PAGES_EN[path].blocs![id];
        const champs = { titre: fr.title, texte: fr.body, titreEn: en.title, texteEn: en.body };
        const avant = await client.fetch<any[]>('*[_type == "bloc" && cle == $cle]{ _id, titre, texte, titreEn, texteEn }', { cle });
        if (!avant.length) await client.createIfNotExists({ _id: `bloc-${idDe(cle)}`, _type: 'bloc', cle });
        const ids = avant.length ? avant.map((d) => d._id) : [`bloc-${idDe(cle)}`];
        for (const docId of ids) await client.patch(docId).set(champs).commit();
        resultat.push({ cle, avant, ids });
    }
    return Response.json({ ok: true, resultat });
}
