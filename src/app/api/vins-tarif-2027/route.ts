import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { PRODUCTS } from '@/data/products';

// Envoi ponctuel dans Sanity des vins de la fiche tarif 2027 (textes, nouveaux millésimes). Aucun prix n'est touché. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = '7ccd9a94b81b671d15f9b68a789a4a8d3d90bc4615c2770d4ec863f0390633b3';

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
    const parSlug = (slug: string) =>
        client.fetch<any>('*[_type == "wine" && slug.current == $slug && !(_id in path("drafts.**"))][0]{ _id, image }', { slug });
    const resultats: string[] = [];

    for (const [i, vin] of PRODUCTS.entries()) {
        const textes = {
            name: vin.name,
            millesime: vin.millesime,
            description: vin.description,
            ordre: i + 1,
            ...(vin.parcelle && { parcelle: vin.parcelle }),
            ...(vin.vinification && { vinification: vin.vinification }),
        };
        const existant = await parSlug(vin.id);
        if (existant) {
            await client.patch(existant._id).set({ ...textes, afficher: true }).commit();
            const brouillon = `drafts.${existant._id}`;
            if (await client.fetch<number>('count(*[_id == $id])', { id: brouillon })) {
                await client.patch(brouillon).set(textes).commit();
                resultats.push(`${vin.id} : mis à jour (+ brouillon)`);
            } else resultats.push(`${vin.id} : mis à jour`);
            continue;
        }
        const base = await parSlug(vin.id.replace(/-\d{4}$/, ''));
        await client.createIfNotExists({
            _id: `wine-${vin.id}`,
            _type: 'wine',
            ...textes,
            subtitle: vin.subtitle,
            slug: { _type: 'slug', current: vin.id },
            enVente: true,
            afficher: true,
            ...(base?.image && { image: base.image }),
            tags: vin.tags,
            volume: vin.volume,
            allergens: vin.allergens,
        });
        resultats.push(`${vin.id} : créé${base?.image ? '' : ' (sans photo)'}`);
    }

    const autres = await client.fetch<any[]>('*[_type == "wine" && !(slug.current in $slugs)]{ _id, name, millesime, afficher }', { slugs: PRODUCTS.map((p) => p.id) });
    return Response.json({ ok: true, resultats, autres });
}
