// Numéros du domaine, dans l'ordre d'affichage.
export const TELEPHONES = [
    { nom: "Romain", numero: "07 82 24 94 36" },
    { nom: "Aurélie", numero: "06 58 83 46 80" },
    { nom: "Isabelle", numero: "06 61 73 56 67" },
    { nom: "Michel", numero: "06 09 41 97 02" },
];

export const telHref = (numero: string) => `tel:+33${numero.replace(/\s/g, "").slice(1)}`;
