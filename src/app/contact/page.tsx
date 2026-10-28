import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
    title: "Contact et accès au domaine, Odenas",
    description: "Contactez le domaine de Garanches : 345 chemin de Garanches, 69460 Odenas, au pied du Mont Brouilly. Ouvert du lundi au samedi, 9h-18h. Romain : 07 82 24 94 36, Aurélie : 06 58 83 46 80, Isabelle : 06 61 73 56 67, Michel : 06 09 41 97 02.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage({ searchParams }: { searchParams: { sujet?: string; vin?: string } }) {
    return (
        <ContactContent sujet={searchParams.sujet} vin={searchParams.vin} />
    );
}
