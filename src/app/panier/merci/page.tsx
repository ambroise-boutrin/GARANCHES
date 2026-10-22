import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { getStripe } from "@/lib/stripe";
import ClearCart from "./ClearCart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Merci pour votre commande | Domaine de Garanches",
    robots: { index: false },
};

export default async function MerciPage({ searchParams }: { searchParams: { session_id?: string } }) {
    let email: string | null = null;
    let paid = false;

    const stripe = getStripe();
    if (stripe && searchParams.session_id) {
        try {
            const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);
            paid = session.payment_status === "paid";
            email = session.customer_details?.email ?? null;
        } catch {
            // Lien invalide : on affiche simplement un message neutre.
        }
    }

    return (
        <main className="min-h-screen pt-36 pb-24 bg-paper">
            {paid && <ClearCart />}
            <FadeIn direction="down" className="max-w-2xl mx-auto px-6 text-center">
                <span className="text-amber-700 font-serif italic text-xl md:text-2xl mb-2 block">Garanches</span>
                <h1 className="text-4xl md:text-6xl font-serif text-wine-900">
                    {paid ? "Merci !" : "Commande en cours"}
                </h1>
                <div className="w-16 h-0.5 bg-amber-500 mx-auto mt-6" />

                <p className="font-serif italic text-xl md:text-2xl text-stone-600 leading-snug mt-10">
                    {paid
                        ? "Votre paiement est bien reçu. Nous préparons vos bouteilles avec soin."
                        : "Nous n'avons pas encore la confirmation de votre paiement. Si vous avez été débité, vous recevrez un e-mail sous peu."}
                </p>
                {paid && email && (
                    <p className="text-stone-500 mt-6">
                        Un reçu vous a été envoyé à <span className="text-stone-900 break-all">{email}</span>.
                    </p>
                )}

                <Link href="/les-vins/cuvees" className="inline-block mt-12 px-10 py-3 bg-red-900/90 hover:bg-red-800 text-white uppercase tracking-widest text-xs font-bold transition-colors border border-red-900">
                    Retour aux cuvées
                </Link>
            </FadeIn>
        </main>
    );
}
