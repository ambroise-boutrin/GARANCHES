import { Metadata } from "next";
import { getSumUpProducts } from "@/lib/sumup";
import { PRODUCTS } from "@/data/products";
import { getPageContent } from "@/sanity/lib/queries";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  description: "Domaine de Garanches, à Odenas au pied du Mont Brouilly : vins de Brouilly et Bourgogne blanc, dégustation au domaine, visite des vignes et vente en ligne.",
};

export default async function Home() {
  // Récupération des produits (SumUp ou Fallback)
  const sumupProducts = await getSumUpProducts();
  const products = sumupProducts && sumupProducts.length > 0 ? sumupProducts : PRODUCTS;

  // Récupération du contenu de la page d'accueil depuis Sanity
  const content = await getPageContent('home');

  return <HomePageClient products={products} content={content} />;
}
