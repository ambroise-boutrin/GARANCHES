// Ponctuation française : une espace insécable avant ! ? ; : » et après «,
// pour que le signe ne parte jamais seul à la ligne (textes saisis dans le studio).
export function typo(text: string): string {
    return text
        .replace(/([^\s(\[{«])[  ]+([!?;:»])(?=[\s"'<)\]*.,]|$)/gmu, "$1 $2")
        .replace(/«[  ]+/g, "« ");
}
