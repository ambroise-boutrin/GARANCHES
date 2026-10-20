import { Fragment } from "react";

// Affiche un texte du document maître : une ligne vide sépare deux paragraphes,
// un simple retour à la ligne est conservé, **texte** passe en gras.
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
    const paragraphs = text.trim().split(/\n\s*\n/);

    return (
        <div className={`space-y-5 ${className}`}>
            {paragraphs.map((paragraph, i) => (
                <p key={i}>
                    {paragraph.split("\n").map((line, j) => (
                        <Fragment key={j}>
                            {j > 0 && <br />}
                            {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                    <strong key={k} className="font-medium text-wine-900">{part.slice(2, -2)}</strong>
                                ) : (
                                    <Fragment key={k}>{part}</Fragment>
                                )
                            )}
                        </Fragment>
                    ))}
                </p>
            ))}
        </div>
    );
}
