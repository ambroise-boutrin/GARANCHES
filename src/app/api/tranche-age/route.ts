import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { TRANCHES_AGE, champTranche } from '@/data/tranchesAge';

// Ajoute 1 au compteur du mois pour la tranche reçue. Rien d'autre n'est enregistré :
// ni date de naissance, ni adresse IP, ni identifiant du visiteur.
export async function POST(request: Request) {
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) return new NextResponse(null, { status: 204 });

    let tranche: unknown;
    try {
        ({ tranche } = await request.json());
    } catch {
        return new NextResponse(null, { status: 400 });
    }
    if (!TRANCHES_AGE.some((t) => t.id === tranche)) return new NextResponse(null, { status: 400 });

    const mois = new Date().toISOString().slice(0, 7);
    const id = `statAge-${mois}`;
    const champ = champTranche(tranche as string);
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

    try {
        await client
            .transaction()
            .createIfNotExists({ _id: id, _type: 'statAge', mois })
            .patch(id, (p) => p.setIfMissing({ [champ]: 0, total: 0 }).inc({ [champ]: 1, total: 1 }))
            .commit();
    } catch (e) {
        console.error('Statistiques d\'âge :', e);
    }
    return new NextResponse(null, { status: 204 });
}
