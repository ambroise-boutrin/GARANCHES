// Ponctuation française : une espace insécable avant ! ? ; : » et après «,
// pour que le signe ne parte jamais seul à la ligne (textes saisis dans le studio).
export function typo(text: string): string {
    return text
        .replace(/([^\s(\[{«])[  ]+([!?;:»])(?=[\s"'<)\]*.,]|$)/gmu, "$1 $2")
        .replace(/«[  ]+/g, "« ")
        // Après un tiret de titre (« 2023 — La générosité du fruit »), un mot court reste collé au suivant :
        // jamais « La » seul en fin de ligne sur téléphone.
        .replace(/([—–] )([\p{L}'’]{1,3}) (?=\p{L})/gu, "$1$2\u00A0")
        // Le tiret reste au bout de la ligne précédente, jamais en début de ligne.
        .replace(/(\S) ([—–]) /gu, "$1\u00A0$2 ");
}
