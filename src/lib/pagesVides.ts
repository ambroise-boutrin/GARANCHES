import { PAGES } from "@/data/architecture";
import { getBlocs } from "@/sanity/lib/queries";

// Pages dont aucun bloc n'a encore de texte (seulement « Texte à venir ») :
// Google ne doit pas les montrer tant qu'elles sont vides (page « mince »).
// Elles restent visibles sur le site et reviennent d'elles-mêmes dans Google dès qu'un texte est saisi.
export async function pagesSansTexte(): Promise<Set<string>> {
    const overrides = await getBlocs("fr");
    return new Set(
        Object.values(PAGES)
            .filter((page) => page.blocs.length > 0 && page.blocs.every((bloc) => !(overrides[`${page.path}#${bloc.id}`]?.texte || bloc.body)))
            .map((page) => page.path),
    );
}
