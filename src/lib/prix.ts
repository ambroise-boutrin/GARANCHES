// Prix affiché d'un vin, en euros. Sans prix renseigné, rien n'est affiché.
export function prixAffiche(wine: { price?: number | null }): string {
    return typeof wine.price === "number" ? `${(wine.price / 100).toFixed(2).replace(".", ",")} €` : "";
}
