import { Fragment } from "react";
import type { ContenuSite, PhotoPrete } from "@/sanity/lib/contenuTypes";
import { TEXTES } from "@/data/textes";
import { cadrage } from "@/data/cadrages";
import { telHref } from "@/data/contacts";

// Numéro français écrit dans un texte (06 12 34 56 78, 06.12.34.56.78, 0612345678).
const NUMERO = /(0[1-9](?:[\s\u00a0\u202f.-]?\d{2}){4})/g;

// Texte où chaque numéro de téléphone devient un lien qui lance l'appel sur téléphone.
export function AvecTelephones({ texte }: { texte: string }) {
    const morceaux = texte.split(NUMERO);
    if (morceaux.length === 1) return <>{texte}</>;
    return (
        <>
            {morceaux.map((morceau, i) =>
                i % 2 === 1 ? (
                    <a key={i} href={telHref(morceau.replace(/[^\d]/g, ""))} className="whitespace-nowrap underline underline-offset-4 decoration-1">
                        {morceau}
                    </a>
                ) : (
                    <Fragment key={i}>{morceau}</Fragment>
                )
            )}
        </>
    );
}

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
                    <AvecTelephones texte={ligne} />
                </Fragment>
            ))}
        </>
    );
}
