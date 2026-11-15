import { stegaClean } from "@sanity/client/stega";

// Numéros du domaine, dans l'ordre d'affichage.
export const TELEPHONES = [
    { nom: "Isabelle", numero: "06 61 73 56 67" },
    { nom: "Aurélie", numero: "06 58 83 46 80" },
    { nom: "Romain", numero: "07 82 24 94 36" },
    { nom: "Michel", numero: "06 09 41 97 02" },
];

// Celles qui répondent le plus (demande d'Ambroise) : en premier et en gras partout.
const PRINCIPAUX = ["isabelle", "aurélie"];
const rang = (nom: string) => PRINCIPAUX.indexOf(stegaClean(nom).trim().toLowerCase());
export const estPrincipal = (nom: string) => rang(nom) >= 0;
// Ordre d'affichage : Isabelle, Aurélie, puis les autres dans l'ordre saisi.
export const rangPrincipal = (nom: string) => (rang(nom) >= 0 ? rang(nom) : PRINCIPAUX.length);

export const telHref = (numero: string) => `tel:+33${numero.replace(/\D/g, "").slice(1)}`;
