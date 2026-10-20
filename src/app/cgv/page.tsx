import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions Générales de Vente",
    description: "Consultez les conditions générales de vente du Domaine de Garanches. Commandes, tarifs, livraison et politique de retour.",
    alternates: { canonical: "/cgv" },
};

export default function CGVPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-wine-900 mb-8 border-b-2 border-wine-100 pb-4">Conditions Générales de Vente</h1>

                <p className="text-sm font-light italic mb-8">Dernière mise à jour : Février 2026</p>

                <h3>1. Objet</h3>
                <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent les ventes de vins et produits associés effectuées par le Domaine de Garanches,
                    situé à Odenas (69460), auprès de ses clients particuliers et professionnels.
                </p>

                <h3>2. Vente d'alcool aux mineurs</h3>
                <p>
                    Conformément à l'article L. 3342-1 du Code de la Santé Publique, la vente d'alcool à des mineurs de moins de 18 ans est interdite.
                    En passant commande sur notre site ou en nous contactant, vous certifiez avoir 18 ans révolus.
                </p>

                <h3>3. Tarifs</h3>
                <p>
                    Les prix de nos produits sont indiqués en Euros toutes taxes comprises (TTC), hors participation aux frais de traitement et d'expédition.
                    Le Domaine de Garanches se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
                </p>

                <h3>4. Commande et Paiement</h3>
                <p>
                    Toute commande vaut acceptation des prix et descriptions des produits disponibles à la vente.
                    Le paiement est exigible immédiatement à la commande. Les règlements peuvent s'effectuer par carte bancaire, chèque ou virement selon les modalités convenues.
                </p>

                <h3>5. Livraison</h3>
                <p>
                    Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande.
                    Les délais de livraison sont donnés à titre indicatif. En cas de retard d'expédition, un mail vous sera adressé pour vous informer d'une éventuelle conséquence sur la date de livraison.
                </p>
                <p>
                    Il appartient au client de vérifier l'état des colis et des vins à la réception et de faire toutes réserves et réclamations qui apparaîtraient justifiées, voire de refuser le colis, si celui-ci est susceptible d'avoir été ouvert ou s'il porte des traces de détérioration.
                </p>

                <h3>6. Droit de rétractation</h3>
                <p>
                    Conformément aux dispositions de l'article L.221-18 du Code de la Consommation, vous disposez d'un délai de rétractation de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétraction sans avoir à justifier de motifs ni à payer de pénalité.
                    Les retours sont à effectuer dans leur état d'origine et complets (bouteilles non ouvertes). Les frais de retour sont à votre charge.
                </p>

                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 my-6 not-prose">
                    <h4 className="font-bold text-wine-900 mb-4">Modèle de formulaire de rétractation :</h4>
                    <p className="text-sm italic mb-4">(Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat)</p>
                    <p className="text-sm">
                        À l'attention du <strong>Domaine de Garanches</strong>,<br />
                        345 chemin de Garanches, 69460 Odenas<br />
                        Email : contact@domainedegaranches.com<br /><br />
                        Je/nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*)/pour la prestation de services (*) ci-dessous :<br /><br />
                        Commandé le (*)/reçu le (*) : ..........................................................................<br />
                        Nom du (des) consommateur(s) : ..........................................................................<br />
                        Adresse du (des) consommateur(s) : ..........................................................................<br />
                        Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) :<br /><br />
                        Date : ..........................................................................<br />
                        <span className="text-xs">(*) Rayez la mention inutile.</span>
                    </p>
                </div>

                <h3>7. Médiation de la consommation (Litiges)</h3>
                <p>
                    Conformément aux articles L.616-1 et R.616-1 du code de la consommation, nous proposons un dispositif de médiation de la consommation.
                    En cas de litige non résolu par une réclamation préalable auprès de notre service client, vous pouvez contacter le médiateur de la consommation compétent.
                    <br /><br />
                    <strong>Médiateur de la consommation :</strong><br />
                    [Nom et coordonnées du médiateur à renseigner]<br />
                    [Site web du médiateur]
                </p>
                <p>
                    À défaut, vous pouvez utiliser la plateforme européenne de règlement en ligne des litiges (RLL) disponible à l'adresse suivante :
                    <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-wine-800 underline">https://ec.europa.eu/consumers/odr</a>.
                </p>

                <h3>8. Loi applicable</h3>
                <p>
                    Les présentes conditions de vente à distance sont soumises à la loi française.
                </p>
            </div>
        </main>
    );
}
