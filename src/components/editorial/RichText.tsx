import { Fragment } from "react";
import { stegaClean } from "@sanity/client/stega";
import { typo } from "@/lib/typo";
import { AvecTelephones } from "@/lib/contenu";

// Affiche un texte du document maître : une ligne vide sépare deux paragraphes,
// un simple retour à la ligne est conservé, **texte** passe en gras,
// un paragraphe qui commence par ### devient un intertitre (casse normale).
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
    // Dans le mode visuel du studio, le texte se termine par des marques invisibles qui le rendent cliquable :
    // on les met de côté avant la mise en forme, puis on les remet après le dernier paragraphe.
    const propre = stegaClean(text);
    const marque = text.startsWith(propre) ? text.slice(propre.length) : "";
    const paragraphs = typo(propre).trim().split(/\n\s*\n/);

    return (
        <div className={`space-y-5 ${className}`}>
            {paragraphs.map((paragraph, i) => paragraph.startsWith("### ") ? (
                <h3 key={i} className="font-serif text-2xl md:text-3xl text-red-900 leading-snug normal-case tracking-normal pt-4 !mb-[-0.5rem]">
                    {paragraph.slice(4).trim()}
                    {i === paragraphs.length - 1 && marque}
                </h3>
            ) : (
                <p key={i}>
                    {paragraph.split("\n").map((line, j) => (
                        <Fragment key={j}>
                            {j > 0 && <br />}
                            {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                    <strong key={k} className={`${/\d{2}[\s\u00a0.]?\d{2}[\s\u00a0.]?\d{2}/.test(part) ? "font-bold" : "font-medium"} text-wine-900`}><AvecTelephones texte={part.slice(2, -2)} /></strong>
                                ) : (
                                    <AvecTelephones key={k} texte={part} />
                                )
                            )}
                        </Fragment>
                    ))}
                    {i === paragraphs.length - 1 && marque}
                </p>
            ))}
        </div>
    );
}
