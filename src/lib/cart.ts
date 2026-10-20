export type CheckoutItem = { id: string; quantity: number };

// Calcule le total d'un panier à partir du catalogue (prix en centimes).
// Renvoie null si un article est inconnu ou si une quantité est invalide.
export function priceCart(items: CheckoutItem[], wines: { id: string; name: string; price: number }[]) {
    let totalInCents = 0;
    const lines: string[] = [];

    for (const item of items) {
        const quantity = Number(item?.quantity);
        const wine = wines.find((w) => w.id === item?.id);
        if (!wine || !Number.isInteger(quantity) || quantity < 1 || quantity > 120 || !(wine.price > 0)) {
            return null;
        }
        totalInCents += wine.price * quantity;
        lines.push(`${quantity} × ${wine.name}`);
    }

    return { totalInCents, lines };
}
