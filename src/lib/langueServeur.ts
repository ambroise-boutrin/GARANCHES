import { cache } from "react";
import { estLangue, type Langue } from "./langue";

// Langue de la page en cours de préparation sur le serveur.
// Chaque page (et sa mise en page) la déclare avec definirLangue(params.lang) ; les composants serveur
// la lisent ensuite avec langueCourante(), sans avoir à la recevoir en paramètre.
const memoire = cache(() => ({ langue: "fr" as Langue }));

export function definirLangue(langue: unknown): Langue {
    const l: Langue = estLangue(langue) ? langue : "fr";
    memoire().langue = l;
    return l;
}

export function langueCourante(): Langue {
    return memoire().langue;
}
