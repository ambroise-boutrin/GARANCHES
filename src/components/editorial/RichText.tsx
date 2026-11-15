import { Fragment } from "react";
import { stegaClean } from "@sanity/client/stega";
import { typo } from "@/lib/typo";
import { AvecTelephones } from "@/lib/contenu";

// Affiche un texte du document maître : une ligne vide sépare deux paragraphes,
// un simple retour à la ligne est conservé, **texte** passe en gras.
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
    // Dans le mode visuel du studio, le texte se termine par des marques invisibles qui le rendent cliquable :
    // on les met de côté avant la mise en forme, puis on les remet après le dernier paragraphe.
    const propre = stegaClean(text);
    const marque = text.startsWith(propre) ? text.slice(propre.length) : "";
    const paragraphs = typo(propre).trim().split(/\n\s*\n/);

    return (
        <div className={`space-y-5 ${className}`}>
            {paragraphs.map((paragraph, i) => (
                <p key={i}>
                    {paragraph.split("\n").map((line, j) => (
                        <Fragment key={j}>
                            {j > 0 && <br />}
                            {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                    <strong key={k} className="font-medium text-wine-900"><AvecTelephones texte={part.slice(2, -2)} /></strong>
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
