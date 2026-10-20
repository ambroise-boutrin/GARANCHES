import { NextResponse } from "next/server";
import { getWines } from "@/lib/wines";
import { priceCart, type CheckoutItem } from "@/lib/cart";

// Le montant est toujours recalculé ici à partir du catalogue (le même que celui affiché
// sur le site) : le navigateur n'envoie que les vins et les quantités, jamais de prix.
export async function POST(req: Request) {
    const { items } = await req.json().catch(() => ({ items: null }));

    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const priced = priceCart(items as CheckoutItem[], await getWines());
    if (!priced) {
        console.warn(`[Checkout] Panier refusé : ${JSON.stringify(items)}`);
        return NextResponse.json({ error: "Article invalide dans le panier" }, { status: 400 });
    }
    const { totalInCents, lines } = priced;

    const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.SUMUP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            checkout_reference: `GARANCHES-${Date.now()}`,
            amount: totalInCents / 100,
            currency: 'EUR',
            description: `Achat : ${lines.join(', ')}`.slice(0, 255),
        }),
    });

    const checkout = await response.json();
    return NextResponse.json({ id: checkout.id });
}
