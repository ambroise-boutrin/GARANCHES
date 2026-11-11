import type { Metadata } from "next";
import ContactContent from "./ContactContent";
import { FAQS } from "@/data/faq";
import { WINERY_ID, filAriane, partage } from "@/lib/site";

export const metadata: Metadata = {
    title: "Contact et accès au domaine, Odenas",
    description: "Domaine de Garanches, 345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly. Ouvert du lundi au samedi de 9h à 18h. Tél. 07 82 24 94 36.",
    alternates: { canonical: "/contact" },
    ...partage({ chemin: "/contact", titre: "Contact et accès | Domaine de Garanches", description: "345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly. Ouvert du lundi au samedi de 9h à 18h." }),
};

export default function ContactPage({ searchParams }: { searchParams: { sujet?: string; vin?: string } }) {
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            about: { "@id": WINERY_ID },
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
        filAriane([{ nom: "Contact", chemin: "/contact" }]),
    ];
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ContactContent sujet={searchParams.sujet} vin={searchParams.vin} />
        </>
    );
}
