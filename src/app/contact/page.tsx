import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata } from "next";
import ContactContent from "./ContactContent";
import { FAQS } from "@/data/faq";
import { getContenuSite } from "@/sanity/lib/contenu";
import { stegaClean } from "next-sanity";
import { WINERY_ID, filAriane, partage } from "@/lib/site";

// Titre et description pour Google : studio (Pages › Contact › Google), sinon ceux-ci.
export async function generateMetadata(): Promise<Metadata> {
    const infos = (await getContenuSite()).pages.contact;
    const description = stegaClean(infos?.seoDescription) || "Domaine de Garanches, 345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly. Ouvert du lundi au samedi de 9h à 18h. Tél. 07 82 24 94 36.";
    return {
        title: stegaClean(infos?.seoTitre) || "Contact et accès au domaine, Odenas",
        description,
        alternates: { canonical: "/contact" },
        ...partage({ chemin: "/contact", titre: "Contact et accès | Domaine de Garanches", description: stegaClean(infos?.seoDescription) || "345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly. Ouvert du lundi au samedi de 9h à 18h." }),
    };
}

export default async function ContactPage({ searchParams }: { searchParams: { sujet?: string; vin?: string } }) {
    const faq = (await getContenuSite()).faq ?? FAQS.map((f) => ({ question: f.question, reponse: f.answer }));
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
        filAriane([{ nom: "Contact", chemin: "/contact" }]),
    ];
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialiserJsonLd(jsonLd) }} />
            <ContactContent sujet={searchParams.sujet} vin={searchParams.vin} />
        </>
    );
}
