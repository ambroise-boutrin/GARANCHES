import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
    title: "Contact",
    description: "Venir, écrire, appeler, réserver : contactez le Domaine de Garanches à Odenas.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage({ searchParams }: { searchParams: { sujet?: string } }) {
    return (
        <ContactContent sujet={searchParams.sujet} />
    );
}
