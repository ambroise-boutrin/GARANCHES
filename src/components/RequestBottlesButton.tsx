import Link from "next/link";

// Pas de boutique en ligne pour l'instant : le bouton mène au formulaire de contact,
// sujet « Commande & Expédition » et message pré-rempli avec le nom du vin.
export function requestBottlesHref(wineName: string) {
    const params = new URLSearchParams({ sujet: "Commande & Expédition", vin: wineName });
    return `/contact?${params.toString()}#formulaire`;
}

// Vin décoché « En vente » dans le studio : mention « Épuisé » à la place du bouton.
export default function RequestBottlesButton({ wine }: { wine: { name: string; enVente?: boolean } }) {
    if (wine.enVente === false) {
        return <p className="mt-6 text-base font-medium text-gray-700">Épuisé</p>;
    }
    return (
        <Link
            href={requestBottlesHref(wine.name)}
            className="inline-flex items-center justify-center w-full md:w-auto mt-6 px-8 py-3 text-base font-medium border border-wine-900 bg-wine-900 text-white hover:bg-white hover:text-wine-900 transition-colors duration-300"
        >
            Demander des bouteilles
        </Link>
    );
}
