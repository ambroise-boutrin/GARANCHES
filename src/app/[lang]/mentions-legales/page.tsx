import type { Metadata } from "next";
import { partage } from "@/lib/site";
import { alternatives } from "@/lib/langue";
import { definirLangue } from "@/lib/langueServeur";
import { MentionsLegalesEn } from "@/i18n/en/legal";
import PageLegale from "@/components/PageLegale";
import { getPageLegale } from "@/sanity/lib/contenu";

type Props = { params: { lang: string } };

export function generateMetadata({ params }: Props): Metadata {
    const langue = definirLangue(params.lang);
    const en = langue === "en";
    return {
        title: en ? "Legal notice" : "Mentions Légales",
        description: en ? "Legal notice of Domaine de Garanches: publisher, host and conditions of use of the estate’s website." : "Mentions légales du Domaine de Garanches. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du site du domaine.",
        alternates: alternatives("/mentions-legales", langue),
        ...partage({ chemin: "/mentions-legales", titre: en ? "Legal notice | Domaine de Garanches" : "Mentions légales | Domaine de Garanches" }),
    };
}

export const revalidate = 60;

export default async function MentionsLegales({ params }: Props) {
    const langue = definirLangue(params.lang);
    // Texte du studio s'il a été importé ou saisi, sinon celui-ci.
    const doc = await getPageLegale("mentions-legales");
    if (doc) return <PageLegale titre={doc.titre} contenu={doc.contenu} />;
    if (langue === "en") return <MentionsLegalesEn />;
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-red-900 mb-8">Mentions Légales</h1>

                <h3>Éditeur du site</h3>
                <p>
                    <strong>GFA Domaine de Garanches</strong><br />
                    345 chemin de Garanches, 69460 Odenas<br />
                    Téléphone : <strong><a href="tel:+33661735667">+33 6 61 73 56 67</a> (Isabelle) · <a href="tel:+33658834680">+33 6 58 83 46 80</a> (Aurélie)</strong> · <a href="tel:+33782249436">+33 7 82 24 94 36</a> (Romain) · <a href="tel:+33609419702">+33 6 09 41 97 02</a> (Michel)<br />
                    Email : contact@domainedegaranches.com<br />
                    <br />
                    <strong>Forme juridique :</strong> Groupement foncier agricole<br />
                    <strong>SIREN :</strong> 400 409 173<br />
                    <strong>SIRET (siège) :</strong> 400 409 173 00012<br />
                    <strong>Numéro RCS :</strong> 400 409 173 R.C.S. Villefranche-Tarare<br />
                    <strong>Numéro de TVA :</strong> FR95400409173<br />
                    <strong>Directeur de la publication :</strong> Ambroise Boutrin
                </p>

                <h3>Hébergement</h3>
                <p>
                    Ce site est hébergé par Vercel Inc.<br />
                    440 N Barranca Ave #4133, Covina, CA 91723, USA.<br />
                    Site : vercel.com · Contact : vercel.com/help
                </p>

                <h3>Crédits photo</h3>
                <p>
                    Photographies : Vianney Tisseau et Domaine de Garanches.
                </p>
            </div>
        </main>
    );
}
