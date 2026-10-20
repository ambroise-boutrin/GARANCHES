"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import FadeIn from "@/components/FadeIn";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            // Le serveur recalcule le prix : on n'envoie que les vins et les quantités.
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(({ id, quantity }) => ({ id, quantity }))
                })
            });

            if (!res.ok) throw new Error('Erreur lors du paiement');

            const data = await res.json();

            if (!data?.id) {
                console.error("No checkout ID returned", data);
                alert("Erreur: Impossible d'initialiser le paiement.");
                return;
            }

            const { id } = data;

            if (id.startsWith('mock-')) {
                alert("Mode Simulation : Paiement validé (Aucun débit)");
                return;
            }

            // @ts-ignore - SumUp SDK is loaded globally via Script tag
            if (typeof SumUpCard === 'undefined') {
                console.error("SumUp SDK not loaded");
                alert("Erreur de chargement du module de paiement. Veuillez recharger la page.");
                return;
            }

            // @ts-ignore
            SumUpCard.mount({
                id: 'sumup-card',
                checkoutId: id,
                onResponse: function (type: any, body: any) {
                    console.log('SumUp response:', type, body);
                }
            });

        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 bg-paper">
            <FadeIn direction="down" className="max-w-5xl mx-auto px-6">
                <h1 className="text-4xl font-serif text-wine-900 mb-8 border-b border-gray-200 pb-4">Votre Panier</h1>

                {cart.length === 0 ? (
                    <FadeIn delay={0.1}>
                        <div className="text-center py-20 bg-white shadow-sm rounded-lg border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
                            <Link href="/les-vins/cuvees" className="inline-block mt-6 px-10 py-4 bg-wine-900 text-white uppercase font-bold tracking-widest hover:bg-wine-800 transition-colors rounded-full">
                                Voir la boutique
                            </Link>
                        </div>
                    </FadeIn>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <FadeIn className="md:col-span-2 space-y-6">



                            {cart.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 shadow-sm border border-gray-100 rounded-lg transition-shadow hover:shadow-md">
                                    <div className="h-32 w-24 relative flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-contain mix-blend-multiply p-2" />
                                    </div>

                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="font-serif text-2xl text-wine-900">{item.name}</h3>
                                        <p className="text-stone-500 font-medium">{(item.price / 100).toFixed(2)} € <span className="text-xs font-light">/ bouteille</span></p>
                                    </div>

                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-wine-900 hover:bg-gray-50 rounded-full transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold text-wine-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-wine-900 hover:bg-gray-50 rounded-full transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs uppercase tracking-wider text-red-400 hover:text-red-600 border-b border-transparent hover:border-red-600 transition-all font-medium"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </FadeIn>

                        <FadeIn className="h-fit" delay={0.2}>
                            <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-lg sticky top-32">
                                <h3 className="font-serif text-2xl text-wine-900 mb-6 border-b border-gray-100 pb-4">Résumé</h3>

                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600 font-serif">Sous-total</span>
                                    <span className="font-bold text-wine-900">{(totalPrice / 100).toFixed(2).replace('.', ',')} €</span>
                                </div>


                                <div className="flex justify-between mb-8 border-t border-gray-100 pt-6">
                                    <span className="font-bold text-xl text-wine-900">Total</span>
                                    <span className="font-bold text-3xl text-wine-900">{(totalPrice / 100).toFixed(2).replace('.', ',')} €</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-wine-900 text-white uppercase font-bold tracking-widest hover:bg-wine-800 transition-all rounded-full shadow-md hover:shadow-lg transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                                >
                                    {isLoading ? "Chargement..." : "Valider mon panier"}
                                </button>


                                {(() => {
                                    const total = cart.reduce((acc, i) => acc + i.quantity, 0);
                                    const reste = total % 6;
                                    const manquant = 6 - reste;

                                    if (total > 0 && reste !== 0) {
                                        return (
                                            <div className="text-center mt-3">
                                                <p className="text-[11px] text-stone-500 italic leading-tight">
                                                    Pour un transport optimal (carton de 6),<br />
                                                    il vous manque <span className="font-semibold text-wine-800">{manquant} bouteille{manquant > 1 ? 's' : ''}</span>.
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                <p className="text-center text-[10px] text-gray-400 mt-6 flex justify-center items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    Paiement sécurisé par SumUp
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                )}
            </FadeIn>
        </main>
    );
}
