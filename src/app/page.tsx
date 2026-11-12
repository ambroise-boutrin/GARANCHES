import { Metadata } from "next";
import { getWines } from "@/lib/wines";
import { getPageContent } from "@/sanity/lib/queries";
import HomePageClient from "@/components/HomePageClient";
import { getContenuSite } from "@/sanity/lib/contenu";
import { stegaClean } from "next-sanity";

export const revalidate = 60;

// Titre et description pour Google : studio (Pages › Accueil › Google), sinon ceux du site.
export async function generateMetadata(): Promise<Metadata> {
  const infos = (await getContenuSite()).pages.accueil;
  const titre = stegaClean(infos?.seoTitre);
  return {
    ...(titre && { title: { absolute: `${titre} | Domaine de Garanches` } }),
    description: stegaClean(infos?.seoDescription) || "Domaine viticole familial à Odenas, au pied du Mont Brouilly : Brouilly, Beaujolais-Villages blanc et Bourgogne blanc. Dégustation et visite des vignes au domaine.",
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  // Même catalogue que la boutique et le paiement (Sanity, sinon la liste statique)
  const products = await getWines();

  // Récupération du contenu de la page d'accueil depuis Sanity
  const content = await getPageContent('home');

  return <HomePageClient products={products} content={content} />;
}
