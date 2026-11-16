import type { ReactNode } from "react";

// Les mots composés (« Beaujolais-Villages », « Lieu-dit ») ne se coupent pas au trait d'union
// sur téléphone : le titre passe à la ligne entre deux mots plutôt qu'au milieu d'un nom.
export function sansCoupure(texte: string): ReactNode {
    return String(texte).split(/(\S+-\S+)/).map((morceau, i) =>
        i % 2 ? <span key={i} className="whitespace-nowrap">{morceau}</span> : morceau
    );
}
