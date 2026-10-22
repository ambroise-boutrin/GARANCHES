// Envoi des commandes payées vers Odoo (bon de commande confirmé, client et adresse de livraison).
// Utilise l'API externe JSON-RPC d'Odoo, disponible sur Odoo Online (offre Custom) et sur
// les installations hébergées. Variables : ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY.

export type OdooOrder = {
    reference: string;
    customer: {
        name: string;
        email: string;
        phone?: string | null;
    };
    shipping?: {
        name?: string | null;
        street?: string | null;
        street2?: string | null;
        zip?: string | null;
        city?: string | null;
        country?: string | null;
    } | null;
    lines: { wineId?: string; name: string; quantity: number; unitPriceInCents: number }[];
    totalInCents: number;
};

function getConfig() {
    const { ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY } = process.env;
    if (!ODOO_URL || !ODOO_DB || !ODOO_LOGIN || !ODOO_API_KEY) return null;
    return { url: ODOO_URL.replace(/\/$/, ""), db: ODOO_DB, login: ODOO_LOGIN, key: ODOO_API_KEY };
}

export function isOdooConfigured() {
    return getConfig() !== null;
}

async function rpc(url: string, service: string, method: string, args: unknown[]) {
    const response = await fetch(`${url}/jsonrpc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: Date.now() }),
        cache: "no-store",
    });
    if (!response.ok) throw new Error(`Odoo HTTP ${response.status}`);
    const json = await response.json();
    if (json.error) throw new Error(json.error.data?.message || json.error.message || "Erreur Odoo");
    return json.result;
}

async function connect() {
    const config = getConfig();
    if (!config) return null;
    const uid = await rpc(config.url, "common", "authenticate", [config.db, config.login, config.key, {}]);
    if (!uid) throw new Error("Odoo : identifiant ou clé API refusés");
    return (model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}) =>
        rpc(config.url, "object", "execute_kw", [config.db, uid, config.key, model, method, args, kwargs]);
}

const euros = (cents: number) => (cents / 100).toFixed(2).replace(".", ",") + " €";

// Crée et confirme le bon de commande. Sans effet si la commande existe déjà (Stripe peut
// renvoyer le même évènement plusieurs fois) ou si Odoo n'est pas configuré.
export async function sendOrderToOdoo(order: OdooOrder) {
    const call = await connect();
    if (!call) return { status: "not_configured" as const };

    const existing = await call("sale.order", "search", [[["client_order_ref", "=", order.reference]]], { limit: 1 });
    if (existing.length > 0) return { status: "exists" as const, id: existing[0] };

    const shipping = order.shipping;
    const countryIds = shipping?.country
        ? await call("res.country", "search", [[["code", "=", shipping.country]]], { limit: 1 })
        : [];
    const address = {
        street: shipping?.street || false,
        street2: shipping?.street2 || false,
        zip: shipping?.zip || false,
        city: shipping?.city || false,
        country_id: countryIds[0] || false,
    };

    // Client : retrouvé par son e-mail, sinon créé.
    const found = await call("res.partner", "search", [[["email", "=ilike", order.customer.email], ["parent_id", "=", false]]], { limit: 1 });
    const partnerId = found[0] ?? await call("res.partner", "create", [{
        name: order.customer.name || order.customer.email,
        email: order.customer.email,
        phone: order.customer.phone || false,
        ...address,
    }]);

    // Adresse de livraison : le client lui-même s'il vient d'être créé, sinon un contact
    // « Adresse de livraison » rattaché (réutilisé si la même adresse existe déjà).
    let shippingId = partnerId;
    if (found[0] && shipping?.street) {
        const delivery = await call("res.partner", "search", [[
            ["parent_id", "=", partnerId], ["type", "=", "delivery"],
            ["street", "=", shipping.street], ["zip", "=", shipping.zip || false],
        ]], { limit: 1 });
        shippingId = delivery[0] ?? await call("res.partner", "create", [{
            parent_id: partnerId,
            type: "delivery",
            name: shipping.name || order.customer.name,
            ...address,
        }]);
    }

    // Lignes : l'article Odoo est retrouvé par sa référence interne (identifiant du vin sur
    // le site), sinon par son nom. Un vin introuvable devient une note à traiter à la main.
    const orderLines: unknown[] = [];
    const missing: string[] = [];
    for (const line of order.lines) {
        const domain = line.wineId
            ? ["|", ["default_code", "=", line.wineId], ["name", "=ilike", line.name]]
            : [["name", "=ilike", line.name]];
        const products = await call("product.product", "search", [[...domain, ["sale_ok", "=", true]]], { limit: 1 });
        if (products.length > 0) {
            orderLines.push([0, 0, {
                product_id: products[0],
                product_uom_qty: line.quantity,
                price_unit: line.unitPriceInCents / 100,
            }]);
        } else {
            missing.push(line.name);
            orderLines.push([0, 0, {
                display_type: "line_note",
                name: `${line.quantity} × ${line.name} à ${euros(line.unitPriceInCents)} (article introuvable dans Odoo)`,
            }]);
        }
    }

    const orderId = await call("sale.order", "create", [{
        partner_id: partnerId,
        partner_invoice_id: partnerId,
        partner_shipping_id: shippingId,
        client_order_ref: order.reference,
        origin: "Site web",
        note: `Payé en ligne par carte (Stripe) : ${euros(order.totalInCents)}. Référence Stripe : ${order.reference}`,
        order_line: orderLines,
    }]);

    // Confirmer réserve le stock et prépare la livraison si l'Inventaire est installé.
    // Si un vin est introuvable, on laisse le devis en brouillon pour vérification.
    if (missing.length === 0) {
        try {
            await call("sale.order", "action_confirm", [[orderId]]);
        } catch (error) {
            console.error("[Odoo] Commande créée mais non confirmée :", error);
        }
    } else {
        console.warn(`[Odoo] Vins introuvables dans Odoo : ${missing.join(", ")}`);
    }

    return { status: "created" as const, id: orderId as number };
}
