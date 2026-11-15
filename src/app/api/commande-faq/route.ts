import { createHash, timingSafeEqual } from 'crypto';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Mise à jour ponctuelle (page Commander et FAQ) dans Sanity. Route retirée après usage.
export const dynamic = 'force-dynamic';

const EMPREINTE = 'a91aaad54c120f9cc16a5ecc0699ce13e05a0df4478dfbaf769015f0c0b7d34b';

const DESCRIPTION_AVANT = "Commander les vins de Garanches en ligne ou les trouver chez les cavistes et restaurants.";
const DESCRIPTION_APRES = "Commander les vins de Garanches au domaine ou les trouver chez les cavistes et restaurants.";
const COMMANDER_AVANT = "Nos vins sont expédiés directement depuis notre cave à Odenas, partout en France.";
const COMMANDER_APRES = "**1. Choisissez vos vins** parmi nos cuvées.\n\n**2. Envoyez-nous votre commande** avec le bouton ci-dessous, ou appelez-nous. Nous vous répondons sous 24 heures.\nRomain : 07 82 24 94 36\nAurélie : 06 58 83 46 80\nIsabelle : 06 61 73 56 67\nMichel : 06 09 41 97 02\n\n**3. Retrait ou livraison** : nous vous confirmons la commande, puis nous l'expédions depuis notre cave à Odenas, partout en France, ou nous la préparons pour un retrait au domaine.\n\nIl n'y a pas de paiement en ligne. Pour une grande quantité, demandez-nous un tarif.";
const FAQ = [
    ["Nous produisons trois vins : un Brouilly (rouge, Gamay), un Beaujolais-Villages blanc et un Bourgogne blanc (Chardonnay).", "Nous produisons trois vins, en plusieurs millésimes : un Brouilly (rouge, Gamay), un Beaujolais-Villages blanc et un Bourgogne blanc (Chardonnay)."],
    ["Oui, nous accueillons les visiteurs pour des dégustations et des visites du domaine sur rendez-vous, du lundi au samedi. N'hésitez pas à nous contacter avant votre venue.", "Oui, nous accueillons les visiteurs pour des dégustations et des visites du domaine, du lundi au samedi de 9h à 18h. Une réservation est conseillée : appelez-nous ou écrivez-nous avant votre venue."],
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
    const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
    const r: Record<string, unknown> = {};
    for (const base of ['page-acheter', 'bloc-acheter-commander', 'bloc-acheter-professionnels', 'faq']) {
        for (const id of [base, `drafts.${base}`]) {
            const doc = await client.fetch<any>('*[_id == $id][0]', { id });
            if (!doc) { r[id] = 'absent'; continue; }
            const set: Record<string, unknown> = {};
            if (doc.description === DESCRIPTION_AVANT) set.description = DESCRIPTION_APRES;
            if (base === 'bloc-acheter-commander') {
                if (doc.texte === COMMANDER_AVANT) set.texte = COMMANDER_APRES;
                if (doc.bouton === 'Commander') set.bouton = 'Passer commande';
            }
            if (base === 'faq' && Array.isArray(doc.questions)) {
                doc.questions.forEach((q: any, i: number) => {
                    const remplacement = FAQ.find(([avant]) => avant === q.reponse);
                    if (remplacement) set[`questions[${i}].reponse`] = remplacement[1];
                });
            }
            if (Object.keys(set).length) await client.patch(id).set(set).commit();
            r[id] = { corrige: Object.keys(set), description: doc.description, texte: doc.texte, bouton: doc.bouton, faq: doc.questions?.map((q: any) => q.reponse) };
        }
    }
    return Response.json({ ok: true, r });
}
