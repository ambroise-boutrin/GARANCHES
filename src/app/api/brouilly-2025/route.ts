import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Corrections ponctuelles dans Sanity : présentation du Brouilly 2025 (français et anglais), plus aucune indication de
// consommation (phrase « apéritifs » du Beaujolais-Villages blanc, étiquettes d'accords : seul le cépage reste). Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = 'a4d7cbe762933082aa42253ce78b90223ae26ab61e06a72d2b4f69acc6d1420c';
const FR_AVANT = "Un nez gourmand aux arômes de fruits exotiques, où se mêlent l'ananas et la mangue, accompagnés de délicates notes miellées. La bouche, suave et généreuse, dévoile une belle expression fruitée, portée par une fraîcheur qui apporte équilibre et éclat à l'ensemble.";
const FR_APRES = "Un nez de fraises fraîchement écrasées et de petits fruits rouges. Une bouche solaire, pleine d’énergie, portée par une belle intensité et des tanins fins. La finale, fraîche et salivante, invite à prolonger la conversation… et le plaisir du partage.";
const EN_AVANT = "A generous nose of exotic fruit, where pineapple and mango mingle with delicate honeyed notes. The palate is smooth and generous, with a lovely fruit expression carried by a freshness that brings balance and brightness.";
const EN_APRES = "A nose of freshly crushed strawberries and small red berries. A sunny palate, full of energy, carried by lovely intensity and fine tannins. The fresh, mouth-watering finish invites you to linger over the conversation… and the pleasure of sharing.";

const BV_FR = [', qui accompagnera à merveille vos apéritifs.', '.'];
const BV_EN = [', a perfect match for your aperitifs.', '.'];
const CEPAGES = ['gamay', 'chardonnay', 'pinot noir', 'aligoté'];

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
    const ids = await client.fetch<string[]>('*[_type == "wine" && slug.current == "brouilly-2025"]._id');
    const resultats: Record<string, string> = {};
    for (const id of ids) {
        const doc = await client.fetch<any>('*[_id == $id][0]{ description, descriptionEn }', { id });
        const set: Record<string, string> = {};
        if (doc?.description?.includes(FR_AVANT)) set.description = doc.description.replace(FR_AVANT, FR_APRES);
        if (doc?.descriptionEn?.includes(EN_AVANT)) set.descriptionEn = doc.descriptionEn.replace(EN_AVANT, EN_APRES);
        if (Object.keys(set).length) await client.patch(id).set(set).commit();
        resultats[id] = Object.keys(set).length ? `corrigé : ${Object.keys(set).join(', ')}` : `inchangé (fr : ${doc?.description?.slice(0, 60)} / en : ${doc?.descriptionEn ? 'présent' : 'vide'})`;
    }
    // Tous les vins : phrase d'apéritif retirée, étiquettes réduites au cépage.
    const vins = await client.fetch<any[]>('*[_type == "wine"]{ _id, "slug": slug.current, description, descriptionEn, tags }');
    for (const v of vins) {
        const set: Record<string, any> = {};
        if (v.description?.includes(BV_FR[0])) set.description = v.description.replace(BV_FR[0], BV_FR[1]);
        if (v.descriptionEn?.includes(BV_EN[0])) set.descriptionEn = v.descriptionEn.replace(BV_EN[0], BV_EN[1]);
        if (Array.isArray(v.tags)) {
            let tags = v.tags.filter((t: string) => CEPAGES.includes(String(t).trim().toLowerCase()));
            if (!tags.length && v.slug === 'beaujolais-villages-blanc') tags = ['Chardonnay'];
            if (tags.length !== v.tags.length) set.tags = tags;
        }
        if (Object.keys(set).length) {
            await client.patch(v._id).set(set).commit();
            resultats[v._id] = `${resultats[v._id] ? resultats[v._id] + ' ; ' : ''}accords retirés : ${Object.keys(set).join(', ')}`;
        }
    }
    return Response.json({ ok: true, resultats });
}
