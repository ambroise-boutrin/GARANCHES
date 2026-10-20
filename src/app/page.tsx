import { Metadata } from "next";
import { getSumUpProducts } from "@/lib/sumup";
import { PRODUCTS } from "@/data/products";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  description: "Garanches, à Odenas au pied du Mont Brouilly. Un lieu. Des vins. Une histoire à vivre. Vins de Brouilly et Bourgogne blanc, rencontres et dégustations au domaine.",
};

export default async function Home() {
  // Récupération des produits (SumUp ou Fallback)
  const sumupProducts = await getSumUpProducts();
  const products = sumupProducts && sumupProducts.length > 0 ? sumupProducts : PRODUCTS;

  return <HomePageClient products={products} />;
}
