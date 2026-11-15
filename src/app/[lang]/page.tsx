import { Metadata } from "next";
import { getGammes } from "@/lib/wines";
import { getPageContent } from "@/sanity/lib/queries";
import HomePageClient from "@/components/HomePageClient";
import { getContenuSite } from "@/sanity/lib/contenu";
import { stegaClean } from "next-sanity";
import { alternatives } from "@/lib/langue";
import { definirLangue } from "@/lib/langueServeur";
import { SEO_AUTRES_EN } from "@/i18n/en/seo";

export const revalidate = 60;

type Props = { params: { lang: string } };

// Titre et description pour Google : studio (Pages › Accueil › Google), sinon ceux du site.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = definirLangue(params.lang);
  const infos = (await getContenuSite()).pages.accueil;
  const titre = stegaClean(infos?.seoTitre);
  const parDefaut = langue === "en"
    ? SEO_AUTRES_EN.accueil.description
    : "Domaine viticole familial à Odenas, au pied du Mont Brouilly : Brouilly, Beaujolais-Villages blanc et Bourgogne blanc. Dégustation et visite des vignes au domaine.";
  return {
    ...(titre && { title: { absolute: `${titre} | Domaine de Garanches` } }),
    description: stegaClean(infos?.seoDescription) || parDefaut,
    alternates: alternatives("/", langue),
  };
}

export default async function Home({ params }: Props) {
  definirLangue(params.lang);
  // Un vin par carte (tous ses millésimes sont sur sa fiche)
  const products = await getGammes();

  // Récupération du contenu de la page d'accueil depuis Sanity
  const content = await getPageContent('home');

  return <HomePageClient products={products} content={content} />;
}
