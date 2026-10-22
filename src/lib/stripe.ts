import Stripe from "stripe";

// Client Stripe côté serveur. Renvoie null tant que la clé secrète n'est pas renseignée,
// pour que le site fonctionne (sans paiement) avant la configuration.
export function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY;
    return key ? new Stripe(key) : null;
}
