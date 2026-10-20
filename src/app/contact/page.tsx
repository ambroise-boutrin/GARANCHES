import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
    title: "Contact et accès au domaine, Odenas",
    description: "Contactez le domaine de Garanches : 345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly. Ouvert du lundi au samedi, 9h-18h. 04 74 03 44 80.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage({ searchParams }: { searchParams: { sujet?: string } }) {
    return (
        <ContactContent sujet={searchParams.sujet} />
    );
}
