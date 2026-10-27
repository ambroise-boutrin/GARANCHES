import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions Légales",
    description: "Mentions légales du Domaine de Garanches. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du site domainedegaranches.com.",
    alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-red-900 mb-8">Mentions Légales</h1>

                <h3>Éditeur du site</h3>
                <p>
                    <strong>Domaine de Garanches</strong><br />
                    145 Rue des Garanches, 69460 Odenas<br />
                    Téléphone : +33 4 74 03 44 80<br />
                    Email : contact@domainedegaranches.com<br />
                    <br />
                    <strong>Forme juridique :</strong> Exploitation Agricole à Responsabilité Limitée (EARL)<br />
                    <strong>Capital social :</strong> [Montant du capital] €<br />
                    <strong>SIRET :</strong> [Numéro SIRET]<br />
                    <strong>RCS :</strong> Villefranche-Tarare [Numéro RCS]<br />
                    <strong>TVA Intracommunautaire :</strong> [Numéro TVA]<br />
                    <strong>Directeur de la publication :</strong> Ambroise Boutrin
                </p>

                <h3>Hébergement</h3>
                <p>
                    Ce site est hébergé par Vercel Inc.<br />
                    440 N Barranca Ave #4133, Covina, CA 91723, USA.
                </p>

                <h3>Propriété intellectuelle</h3>
                <p>
                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
                </p>
            </div>
        </main>
    );
}
