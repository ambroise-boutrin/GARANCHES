import { stegaClean } from "@sanity/client/stega";

// Numéros du domaine, dans l'ordre d'affichage.
export const TELEPHONES = [
    { nom: "Isabelle", numero: "06 61 73 56 67" },
    { nom: "Aurélie", numero: "06 58 83 46 80" },
];

// Celles qui répondent le plus (demande d'Ambroise) : en premier et en gras partout.
const PRINCIPAUX = ["isabelle", "aurélie"];
const rang = (nom: string) => PRINCIPAUX.indexOf(stegaClean(nom).trim().toLowerCase());
export const estPrincipal = (nom: string) => rang(nom) >= 0;
// Ordre d'affichage : Isabelle, Aurélie, puis les autres dans l'ordre saisi.
export const rangPrincipal = (nom: string) => (rang(nom) >= 0 ? rang(nom) : PRINCIPAUX.length);

// Lien d'appel, pour un numéro écrit à la française (06 12 34 56 78) ou à l'international (+33 6 12 34 56 78).
export const telHref = (numero: string) => {
    const chiffres = numero.replace(/\D/g, "");
    return chiffres.startsWith("33") ? `tel:+${chiffres}` : `tel:+33${chiffres.slice(1)}`;
};

// Sur la version anglaise, les numéros sont écrits à l'international : 06 12 34 56 78 → +33 6 12 34 56 78.
export const numeroInternational = (numero: string) => {
    const chiffres = numero.replace(/\D/g, "");
    if (chiffres.length !== 10 || !chiffres.startsWith("0")) return numero;
    return `+33 ${chiffres[1]} ${chiffres.slice(2).match(/\d{2}/g)!.join(" ")}`;
};
