import { NextResponse } from "next/server";
import { getWines } from "@/lib/wines";
import { priceCart, type CheckoutItem } from "@/lib/cart";
import { getStripe } from "@/lib/stripe";
import { wineSlug } from "@/lib/wineSlug";

// Le montant est toujours recalculé ici à partir du catalogue (le même que celui affiché
// sur le site) : le navigateur n'envoie que les vins et les quantités, jamais de prix.
// On crée ensuite une page de paiement Stripe Checkout et on renvoie son adresse.
export async function POST(req: Request) {
    const stripe = getStripe();
    if (!stripe) {
        return NextResponse.json({ error: "Le paiement en ligne n'est pas encore activé." }, { status: 503 });
    }

    const { items } = await req.json().catch(() => ({ items: null }));

    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const wines = await getWines();
    const priced = priceCart(items as CheckoutItem[], wines);
    if (!priced) {
        console.warn(`[Checkout] Panier refusé : ${JSON.stringify(items)}`);
        return NextResponse.json({ error: "Article invalide dans le panier" }, { status: 400 });
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/$/, "");
    const absolute = (src?: string) => (!src ? undefined : src.startsWith("http") ? src : `${siteUrl}${src}`);

    const lineItems = (items as CheckoutItem[]).map(({ id, quantity }) => {
        const wine = wines.find((w: any) => w.id === id);
        const image = absolute(wine.image);
        return {
            quantity: Number(quantity),
            price_data: {
                currency: "eur",
                unit_amount: wine.price,
                product_data: {
                    name: wine.name,
                    ...(wine.subtitle ? { description: wine.subtitle } : {}),
                    ...(image ? { images: [image] } : {}),
                    // Sert à retrouver l'article dans Odoo (champ « Référence interne ») : le slug du vin.
                    metadata: { wine_id: wineSlug(wine) },
                },
            },
        };
    });

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            locale: "fr",
            line_items: lineItems,
            shipping_address_collection: { allowed_countries: ["FR"] },
            phone_number_collection: { enabled: true },
            billing_address_collection: "auto",
            success_url: `${siteUrl}/panier/merci?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/panier`,
            metadata: { panier: priced.lines.join(", ").slice(0, 500) },
        });
        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[Checkout] Stripe :", error);
        return NextResponse.json({ error: "Impossible d'ouvrir la page de paiement." }, { status: 502 });
    }
}
