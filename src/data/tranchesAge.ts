// Tranches d'âge comptées à l'entrée du site. Seule la tranche est envoyée au serveur :
// la date de naissance reste dans le navigateur du visiteur et n'est jamais enregistrée.
export const TRANCHES_AGE = [
    { id: "18-24", min: 18, max: 24 },
    { id: "25-34", min: 25, max: 34 },
    { id: "35-44", min: 35, max: 44 },
    { id: "45-54", min: 45, max: 54 },
    { id: "55-64", min: 55, max: 64 },
    { id: "65+", min: 65, max: Infinity },
] as const;

export type TrancheAge = (typeof TRANCHES_AGE)[number]["id"];

// Nom du champ Sanity correspondant à une tranche (« 65+ » n'est pas un nom de champ valide).
export const champTranche = (id: string) => "t_" + id.replace("-", "_").replace("+", "_plus");

export function trancheDe(age: number): TrancheAge | null {
    return TRANCHES_AGE.find((t) => age >= t.min && age <= t.max)?.id ?? null;
}

export function calculerAge(jour: number, mois: number, annee: number, aujourdhui = new Date()): number | null {
    const naissance = new Date(annee, mois - 1, jour);
    if (naissance.getFullYear() !== annee || naissance.getMonth() !== mois - 1 || naissance.getDate() !== jour) return null;
    if (naissance > aujourdhui || annee < aujourdhui.getFullYear() - 120) return null;
    let age = aujourdhui.getFullYear() - annee;
    const anniversairePasse =
        aujourdhui.getMonth() > mois - 1 || (aujourdhui.getMonth() === mois - 1 && aujourdhui.getDate() >= jour);
    if (!anniversairePasse) age--;
    return age;
}
