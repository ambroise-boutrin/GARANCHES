// Prix affiché d'un vin : en euros, ou « Prix sur demande » quand il n'est pas renseigné.
export function prixAffiche(wine: { price?: number | null }): string {
    return typeof wine.price === "number" ? `${(wine.price / 100).toFixed(2).replace(".", ",")} €` : "Prix sur demande";
}
