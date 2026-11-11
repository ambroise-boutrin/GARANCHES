import type { Metadata } from "next";
import { partage } from "@/lib/site";

export const metadata: Metadata = {
    title: "Mentions Légales",
    description: "Mentions légales du Domaine de Garanches. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du site du domaine.",
    alternates: { canonical: "/mentions-legales" },
    ...partage({ chemin: "/mentions-legales", titre: "Mentions légales | Domaine de Garanches" }),
};

export default function MentionsLegales() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-red-900 mb-8">Mentions Légales</h1>

                <h3>Éditeur du site</h3>
                <p>
                    <strong>GFA Domaine de Garanches</strong><br />
                    345 chemin de Garanches, 69460 Odenas<br />
                    Téléphone : +33 7 82 24 94 36 (Romain) · +33 6 58 83 46 80 (Aurélie) · +33 6 61 73 56 67 (Isabelle) · +33 6 09 41 97 02 (Michel)<br />
                    Email : contact@domainedegaranches.com<br />
                    <br />
                    <strong>Forme juridique :</strong> Groupement foncier agricole<br />
                    <strong>SIREN :</strong> 400 409 173<br />
                    <strong>SIRET (siège) :</strong> 400 409 173 00012<br />
                    <strong>Numéro RCS :</strong> 400 409 173 R.C.S. Villefranche-Tarare<br />
                    <strong>Inscription au RCS et au RNE :</strong> le 31/10/2002<br />
                    <strong>Numéro de TVA :</strong> FR95400409173<br />
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
