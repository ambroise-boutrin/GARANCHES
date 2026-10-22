"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import FadeIn from "@/components/FadeIn";
import { useState } from "react";
import { cuveeHref } from "@/lib/wineSlug";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Le serveur recalcule le prix : on n'envoie que les vins et les quantités.
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(({ id, quantity }) => ({ id, quantity }))
                })
            });
            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.url) {
                setError(data?.error || "Le paiement n'a pas pu démarrer. Merci de réessayer.");
                setIsLoading(false);
                return;
            }

            // Direction la page de paiement sécurisée Stripe (carte, Apple Pay, Google Pay).
            window.location.href = data.url;
        } catch (e) {
            console.error(e);
            setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
            setIsLoading(false);
        }
    };

    const euros = (cents: number) => (cents / 100).toFixed(2).replace('.', ',') + " €";
    const bouteilles = cart.reduce((acc, i) => acc + i.quantity, 0);
    const manquant = bouteilles % 6 === 0 ? 0 : 6 - (bouteilles % 6);

    return (
        <main className="min-h-screen pt-36 pb-24 bg-paper">
            <div className="max-w-5xl mx-auto px-6">
                <FadeIn direction="down" className="text-center mb-16">
                    <span className="text-amber-700 font-serif italic text-xl md:text-2xl mb-2 block">Garanches</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-wine-900">Votre panier</h1>
                    <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-6" />
                </FadeIn>

                {cart.length === 0 ? (
                    <FadeIn delay={0.1} className="text-center py-12">
                        <p className="font-serif italic text-2xl text-stone-600">Aucune bouteille pour l&apos;instant.</p>
                        <Link href="/les-vins/cuvees" className="inline-block mt-10 px-10 py-3 bg-red-900/90 hover:bg-red-800 text-white uppercase tracking-widest text-xs font-bold transition-colors border border-red-900">
                            Découvrir les cuvées
                        </Link>
                    </FadeIn>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_320px] gap-16">
                        <FadeIn>
                            <ul className="border-t border-stone-300">
                                {cart.map((item) => (
                                    <li key={item.id} className="grid grid-cols-[88px_1fr] sm:grid-cols-[96px_1fr_auto] gap-x-6 gap-y-4 items-center py-8 border-b border-stone-300">
                                        <Link href={cuveeHref(item)} className="row-span-2 sm:row-span-1 h-24 sm:h-32 relative block">
                                            <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain mix-blend-multiply" />
                                        </Link>

                                        <div>
                                            <Link href={cuveeHref(item)} className="font-serif text-2xl md:text-3xl text-wine-900 hover:text-amber-700 transition-colors">
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-stone-500 mt-1">{euros(item.price)} la bouteille</p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="mt-3 text-xs text-stone-400 underline underline-offset-4 hover:text-red-900 transition-colors"
                                            >
                                                Retirer
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-8">
                                            <div className="flex items-center border border-stone-300" aria-label={`Quantité de ${item.name}`}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    aria-label="Retirer une bouteille"
                                                    className="w-9 h-9 text-stone-500 hover:text-wine-900 hover:bg-stone-100 transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-sm text-stone-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    aria-label="Ajouter une bouteille"
                                                    className="w-9 h-9 text-stone-500 hover:text-wine-900 hover:bg-stone-100 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="w-24 text-right text-stone-900">{euros(item.price * item.quantity)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/les-vins/cuvees" className="group inline-flex items-center mt-8 text-red-900 uppercase text-xs font-bold tracking-widest hover:text-amber-600 transition-colors">
                                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Continuer mes achats
                            </Link>
                        </FadeIn>

                        <FadeIn delay={0.15} className="h-fit lg:sticky lg:top-32">
                            <div className="border-t-2 border-wine-900 pt-6">
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between text-stone-600">
                                        <dt>{bouteilles} bouteille{bouteilles > 1 ? "s" : ""}</dt>
                                        <dd>{euros(totalPrice)}</dd>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-4 border-t border-stone-300">
                                        <dt className="font-serif text-2xl text-wine-900">Total</dt>
                                        <dd className="font-serif text-2xl text-wine-900">{euros(totalPrice)}</dd>
                                    </div>
                                </dl>

                                {manquant > 0 && (
                                    <p className="font-serif italic text-lg text-stone-600 leading-snug mt-8">
                                        Nos vins voyagent par cartons de six : encore {manquant} bouteille{manquant > 1 ? "s" : ""} pour compléter le vôtre.
                                    </p>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full mt-8 px-8 py-4 bg-red-900/90 hover:bg-red-800 text-white uppercase tracking-widest text-xs font-bold transition-colors border border-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Ouverture du paiement…" : "Passer au paiement"}
                                </button>

                                {error && (
                                    <p role="alert" className="text-sm text-red-900 mt-4 text-center">{error}</p>
                                )}

                                <p className="text-xs text-stone-400 mt-4 text-center">Paiement sécurisé par Stripe : carte bancaire, Apple Pay ou Google Pay</p>
                            </div>
                        </FadeIn>
                    </div>
                )}
            </div>
        </main>
    );
}
