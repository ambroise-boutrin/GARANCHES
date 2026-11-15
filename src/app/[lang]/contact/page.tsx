import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata } from "next";
import ContactContent from "./ContactContent";
import { FAQS } from "@/data/faq";
import { getContenuSite } from "@/sanity/lib/contenu";
import { stegaClean } from "next-sanity";
import { WINERY_ID, filAriane, partage } from "@/lib/site";
import { alternatives } from "@/lib/langue";
import { definirLangue } from "@/lib/langueServeur";
import { SEO_AUTRES_EN } from "@/i18n/en/seo";
import { FAQS_EN } from "@/i18n/en/divers";

type Props = { params: { lang: string }; searchParams: { sujet?: string; vin?: string } };

// Titre et description pour Google : studio (Pages › Contact › Google), sinon ceux-ci.
export async function generateMetadata({ params }: Omit<Props, "searchParams">): Promise<Metadata> {
    const langue = definirLangue(params.lang);
    const en = langue === "en";
    const infos = (await getContenuSite()).pages.contact;
    const seoDescription = stegaClean(infos?.seoDescription);
    const description = seoDescription || (en ? SEO_AUTRES_EN.contact.description : "Domaine de Garanches, 345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly. Ouvert du lundi au samedi de 9h à 18h. Tél. 06 61 73 56 67.");
    return {
        title: stegaClean(infos?.seoTitre) || (en ? SEO_AUTRES_EN.contact.title : "Contact et accès au domaine, Odenas"),
        description,
        alternates: alternatives("/contact", langue),
        ...partage({
            chemin: "/contact",
            titre: en ? SEO_AUTRES_EN.contact.partageTitre : "Contact et accès | Domaine de Garanches",
            description: seoDescription || (en ? SEO_AUTRES_EN.contact.partageDescription : "345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly. Ouvert du lundi au samedi de 9h à 18h."),
        }),
    };
}

export default async function ContactPage({ params, searchParams }: Props) {
    const langue = definirLangue(params.lang);
    const faq = (await getContenuSite()).faq ?? (langue === "en" ? FAQS_EN : FAQS).map((f) => ({ question: f.question, reponse: f.answer }));
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            about: { "@id": WINERY_ID },
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: stegaClean(f.question),
                acceptedAnswer: { "@type": "Answer", text: stegaClean(f.reponse) },
            })),
        },
        filAriane([{ nom: "Contact", chemin: "/contact" }], langue),
    ];
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialiserJsonLd(jsonLd) }} />
            <ContactContent sujet={searchParams.sujet} vin={searchParams.vin} />
        </>
    );
}
