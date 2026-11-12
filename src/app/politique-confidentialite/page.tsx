import type { Metadata } from "next";
import { partage } from "@/lib/site";
import PageLegale from "@/components/PageLegale";
import { getPageLegale } from "@/sanity/lib/contenu";

export const metadata: Metadata = {
    title: "Politique de Confidentialité",
    description: "Découvrez comment le Domaine de Garanches protège et utilise vos données personnelles conformément au RGPD.",
    alternates: { canonical: "/politique-confidentialite" },
    ...partage({ chemin: "/politique-confidentialite", titre: "Politique de confidentialité | Domaine de Garanches" }),
};

export const revalidate = 60;

export default async function PolitiqueConfidentialite() {
    // Texte du studio s'il a été importé ou saisi, sinon celui-ci.
    const doc = await getPageLegale("politique-confidentialite");
    if (doc) return <PageLegale titre={doc.titre} contenu={doc.contenu} />;
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-wine-900 mb-8 border-b-2 border-wine-100 pb-4">Politique de Confidentialité</h1>

                <p className="text-sm text-stone-700 mb-8">
                    Dernière mise à jour : novembre 2026
                </p>

                <p>
                    Cette politique explique quelles données personnelles nous recevons par ce site, pourquoi, combien de temps nous les gardons et quels sont vos droits.
                    Ce site ne contient ni publicité ni cookie de suivi, et vous n'avez pas besoin de créer de compte.
                </p>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">1. Responsable du traitement</h2>
                <p>
                    <strong>GFA Domaine de Garanches</strong><br />
                    345 chemin de Garanches, 69460 Odenas<br />
                    SIREN 400 409 173<br />
                    Email : contact@domainedegaranches.com
                </p>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">2. Données que nous recevons</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Vos messages :</strong> le formulaire de contact ouvre votre propre messagerie. Nous recevons donc l'email que vous nous envoyez, avec votre nom, votre adresse email et, si vous les indiquez, votre téléphone et votre message. Rien n'est enregistré par le site lui-même.</li>
                    <li><strong>Vos commandes et réservations :</strong> si vous nous commandez des bouteilles ou réservez une visite, nous gardons les informations utiles (nom, coordonnées, adresse de livraison, détail de la commande).</li>
                    <li id="tranches-age" className="scroll-mt-28"><strong>Vérification de l'âge :</strong> à l'entrée du site, nous vous demandons votre date de naissance pour vérifier que vous êtes majeur. Cette date est utilisée uniquement dans votre navigateur et n'est ni transmise ni conservée. Seule votre tranche d'âge (18-24, 25-34, 35-44, 45-54, 55-64, 65 ans et plus) est ajoutée à un compteur mensuel anonyme, sans adresse IP ni identifiant. Aucune donnée ne permet de vous identifier.</li>
                    <li><strong>Mesure d'audience :</strong> nous utilisons Plausible Analytics, un outil européen sans cookie qui compte les pages vues de façon anonyme, sans suivre les visiteurs d'un site à l'autre.</li>
                    <li><strong>Mémoire de votre navigateur :</strong> le site garde dans votre navigateur le fait que vous avez confirmé votre âge et vos choix sur les cookies, pour ne pas vous les redemander. Ces informations restent sur votre appareil.</li>
                    <li><strong>Carte Google Maps :</strong> sur la page Contact, la carte ne se charge que si vous cliquez sur « Afficher la carte ». Google reçoit alors votre adresse IP et peut déposer ses propres cookies, selon sa politique de confidentialité.</li>
                </ul>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">3. Pourquoi et sur quelle base</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Répondre à vos messages et demandes de visite : notre intérêt légitime à vous répondre, ou les mesures préalables à un contrat que vous demandez.</li>
                    <li>Préparer, livrer et facturer vos commandes : l'exécution du contrat de vente, et nos obligations comptables.</li>
                    <li>Vérifier que les visiteurs sont majeurs : notre obligation légale de ne pas vendre d'alcool aux mineurs.</li>
                    <li>Statistiques anonymes (âge, audience) : notre intérêt légitime à améliorer le site. Ces données ne vous identifient pas.</li>
                    <li>Carte Google Maps : votre consentement, donné en cliquant pour l'afficher.</li>
                </ul>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">4. Qui y a accès</h2>
                <p>
                    Seules les personnes du domaine qui traitent votre demande. Nous faisons aussi appel à des prestataires techniques, qui n'utilisent pas vos données pour leur propre compte :
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Vercel Inc. (États-Unis), hébergeur du site. Le transfert vers les États-Unis est encadré par le Data Privacy Framework et les clauses contractuelles types de la Commission européenne.</li>
                    <li>Sanity (Norvège), qui stocke les textes et photos du site ainsi que le compteur anonyme des tranches d'âge.</li>
                    <li>Plausible Analytics (Union européenne), pour la mesure d'audience anonyme.</li>
                    <li>Notre fournisseur de messagerie, qui reçoit vos emails, et le transporteur qui livre votre commande.</li>
                </ul>
                <p>Nous ne vendons ni ne louons jamais vos données.</p>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">5. Combien de temps</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Messages et demandes :</strong> 3 ans au plus après notre dernier échange.</li>
                    <li><strong>Commandes et factures :</strong> 10 ans (obligation comptable).</li>
                    <li><strong>Mémoire de votre navigateur :</strong> jusqu'à ce que vous l'effaciez, et au plus 13 mois pour vos choix sur les cookies.</li>
                </ul>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">6. Vos droits</h2>
                <p>
                    Vous pouvez demander à accéder à vos données, à les corriger, à les effacer, à en limiter l'usage, à les récupérer, ou vous opposer à leur utilisation.
                    Vous pouvez aussi nous indiquer ce que nous devons faire de vos données après votre décès.
                </p>
                <p>
                    Écrivez-nous à <strong>contact@domainedegaranches.com</strong> ou au 345 chemin de Garanches, 69460 Odenas. Nous répondons sous un mois.
                    Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (www.cnil.fr).
                </p>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">7. Sécurité</h2>
                <p>
                    Le site est servi uniquement en HTTPS, et l'accès à l'outil de gestion du site est réservé aux personnes du domaine.
                </p>
            </div>
        </main>
    );
}
