import { Metadata } from "next";
import { getSumUpProducts } from "@/lib/sumup";
import { PRODUCTS } from "@/data/products";
import { getPageContent } from "@/sanity/lib/queries";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  description: "Domaine viticole historique à Odenas depuis 1788. Vins de Brouilly et Bourgogne Blanc par Romain Martinache & Aurélie Crozet. Dégustation et vente directe au pied du Mont Brouilly.",
};

export default async function Home() {
  // Récupération des produits (SumUp ou Fallback)
  const sumupProducts = await getSumUpProducts();
  const products = sumupProducts && sumupProducts.length > 0 ? sumupProducts : PRODUCTS;

  // Récupération du contenu de la page d'accueil depuis Sanity
  const content = await getPageContent('home');

  return <HomePageClient products={products} content={content} />;
}
