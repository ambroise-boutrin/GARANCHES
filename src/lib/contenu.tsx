import { Fragment } from "react";
import type { ContenuSite, PhotoPrete } from "@/sanity/lib/contenuTypes";
import { TEXTES } from "@/data/textes";
import { cadrage } from "@/data/cadrages";

// Lecture d'un texte ou d'une photo du site (serveur et navigateur) : la valeur du studio, sinon celle de src/data/textes.ts.
export function texteDe(contenu: ContenuSite, cle: string): string {
    return contenu.textes[cle] ?? TEXTES[cle]?.defaut ?? "";
}

export function photoDe(contenu: ContenuSite, cle: string): PhotoPrete {
    const src = TEXTES[cle]?.defaut ?? "";
    return contenu.photos[cle] ?? { src, position: cadrage(src) };
}

// Texte sur plusieurs lignes : chaque retour à la ligne devient un passage à la ligne.
export function Lignes({ texte }: { texte: string }) {
    const lignes = texte.split("\n");
    return (
        <>
            {lignes.map((ligne, i) => (
                <Fragment key={i}>
                    {i > 0 && <br />}
                    {ligne}
                </Fragment>
            ))}
        </>
    );
}
