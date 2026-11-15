import { notFound } from "next/navigation";
import { definirLangue } from "@/lib/langueServeur";

// Adresse qui ne correspond à aucune page : la page « introuvable » du site, dans la langue de l'adresse.
// (Sans cela, Next afficherait sa page d'erreur brute pour les adresses sous /contact/…, /cgv/…, etc.)
export default function Introuvable({ params }: { params: { lang: string } }) {
    definirLangue(params.lang);
    notFound();
}
