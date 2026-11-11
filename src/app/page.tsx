import { Metadata } from "next";
import { getWines } from "@/lib/wines";
import { getPageContent } from "@/sanity/lib/queries";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  description: "Domaine viticole familial à Odenas, au pied du Mont Brouilly : Brouilly, Beaujolais-Villages blanc et Bourgogne blanc. Dégustation et visite des vignes au domaine.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Même catalogue que la boutique et le paiement (Sanity, sinon la liste statique)
  const products = await getWines();

  // Récupération du contenu de la page d'accueil depuis Sanity
  const content = await getPageContent('home');

  return <HomePageClient products={products} content={content} />;
}
