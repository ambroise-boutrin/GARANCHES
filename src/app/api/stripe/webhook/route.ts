import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sendOrderToOdoo } from "@/lib/odoo";

// Stripe appelle cette adresse quand un paiement est terminé. On transmet alors la commande
// à Odoo. En cas d'échec on répond 500 : Stripe réessaie pendant plusieurs jours, et la
// commande n'est jamais créée deux fois (elle est retrouvée par sa référence Stripe).
export async function POST(req: Request) {
    const stripe = getStripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !secret) {
        return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature") ?? "", secret);
    } catch (error) {
        console.warn("[Stripe] Signature invalide :", error);
        return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
    }

    if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
        return NextResponse.json({ received: true });
    }

    const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
        expand: ["line_items.data.price.product"],
    });
    if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
    }

    const customer = session.customer_details;
    const shipping = session.collected_information?.shipping_details ?? session.shipping_details;

    try {
        const result = await sendOrderToOdoo({
            reference: session.id,
            customer: {
                name: customer?.name || shipping?.name || "",
                email: customer?.email || "",
                phone: customer?.phone,
            },
            shipping: shipping?.address
                ? {
                    name: shipping.name,
                    street: shipping.address.line1,
                    street2: shipping.address.line2,
                    zip: shipping.address.postal_code,
                    city: shipping.address.city,
                    country: shipping.address.country,
                }
                : null,
            lines: (session.line_items?.data ?? []).map((item) => {
                const product = item.price?.product as Stripe.Product | undefined;
                return {
                    wineId: product?.metadata?.wine_id,
                    name: product?.name || item.description || "Vin",
                    quantity: item.quantity ?? 1,
                    unitPriceInCents: item.price?.unit_amount ?? 0,
                };
            }),
            totalInCents: session.amount_total ?? 0,
        });
        console.log(`[Odoo] Commande ${session.id} : ${result.status}`);
    } catch (error) {
        console.error(`[Odoo] Échec pour la commande ${session.id} :`, error);
        return NextResponse.json({ error: "Envoi vers Odoo impossible" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
