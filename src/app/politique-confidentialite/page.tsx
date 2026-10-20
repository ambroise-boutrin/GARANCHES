import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de Confidentialité",
    description: "Découvrez comment le Domaine de Garanches protège et utilise vos données personnelles conformément au RGPD.",
    alternates: { canonical: "/politique-confidentialite" },
};

export default function PolitiqueConfidentialite() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-wine-900 mb-8 border-b-2 border-wine-100 pb-4">Politique de Confidentialité</h1>

                <p className="text-sm text-stone-500 italic mb-8">
                    Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                </p>

                <p>
                    Le Domaine de Garanches attache une grande importance à la protection de votre vie privée. Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
                </p>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">1. Responsable du traitement</h2>
                <p>
                    Les données personnelles collectées sur ce site sont traitées par :<br />
                    <strong>Domaine de Garanches</strong><br />
                    345 chemin de Garanches, 69460 Odenas<br />
                    Email : contact@domainedegaranches.com
                </p>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">2. Données collectées</h2>
                <p>Nous pouvons collecter les données suivantes :</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Données de commande :</strong> Nom, prénom, adresse de livraison et de facturation, email, numéro de téléphone. Ces données sont nécessaires à l'exécution du contrat de vente.</li>
                    <li><strong>Données de contact :</strong> Informations transmises via notre formulaire de contact ou par email.</li>
                    <li><strong>Données de navigation (Cookies) :</strong> Voir notre gestionnaire de cookies pour plus de détails.</li>
                </ul>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">3. Finalités du traitement</h2>
                <p>Vos données sont collectées pour :</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Gérer et expédier vos commandes de vin.</li>
                    <li>Répondre à vos demandes d'information ou de visite.</li>
                    <li>Respecter nos obligations légales (comptabilité, vérification de l'âge légal).</li>
                    <li>Améliorer notre site et nos services.</li>
                </ul>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">4. Destinataires des données</h2>
                <p>
                    Vos données sont destinées au personnel du Domaine de Garanches. Elles peuvent être transmises à nos sous-traitants pour l'exécution des services (ex: transporteurs pour la livraison, prestataire de paiement sécurisé).
                    Nous ne vendons jamais vos données à des tiers.
                </p>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">5. Conservation des données</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Commandes :</strong> Conservées pendant 10 ans (obligation légale comptable).</li>
                    <li><strong>Demandes de contact :</strong> Conservées pendant 3 ans maximum après le dernier contact.</li>
                    <li><strong>Cookies :</strong> Conservés 13 mois maximum.</li>
                </ul>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">6. Vos droits (RGPD)</h2>
                <p>
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité de vos données.
                </p>
                <p>
                    Pour exercer ces droits, contactez-nous par email à <strong>contact@domainedegaranches.com</strong> ou par courrier postal.
                    Vous avez également le droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).
                </p>

                <h2 className="text-xl font-serif text-wine-800 mt-8 mb-4">7. Sécurité</h2>
                <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la perte ou l'altération (protocole HTTPS, paiement sécurisé).
                </p>
            </div>
        </main>
    );
}
