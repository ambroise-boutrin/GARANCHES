import { stegaClean } from "next-sanity";
import { getGammes } from "@/lib/wines";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TELEPHONES } from "@/data/contacts";

// Résumé du site pour les assistants IA (ChatGPT, Claude, Perplexity…), au format llms.txt :
// qui est le domaine, ses vins millésime par millésime, les pages utiles. Aucun prix.
export const revalidate = 3600;

export async function GET() {
    const gammes = await getGammes();
    const propre = (t?: string) => stegaClean(String(t || "")).replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
    const vins = gammes
        .map((g) => {
            const millesimes = g.millesimes
                .map((w) => `- ${propre(w.name)} ${propre(w.millesime)} (${SITE_URL}/les-vins/cuvees/${g.slug}#${propre(w.millesime)}) : ${propre(w.description)}`)
                .join("\n");
            return `### ${propre(g.name)}${g.subtitle ? ` — ${propre(g.subtitle)}` : ""}\n${millesimes}`;
        })
        .join("\n\n");

    const texte = `# ${SITE_NAME}

> Domaine viticole familial à Odenas (Beaujolais), au pied du Mont Brouilly. Vignerons indépendants, vendanges à la main. Vins : Brouilly, Beaujolais-Villages blanc et Bourgogne blanc. Pas de vente en ligne : les bouteilles se commandent auprès du domaine (formulaire de contact ou téléphone), avec expédition en France. Dégustations et visites des vignes au domaine, sur réservation.

## Les vins

${vins}

## Pages utiles

- [Les cuvées](${SITE_URL}/les-vins/cuvees) : tous les vins et leurs millésimes
- [Commander](${SITE_URL}/acheter) : comment commander des bouteilles
- [Déguster au domaine](${SITE_URL}/rencontrons-garanches/deguster-au-domaine)
- [Découvrir les vignes](${SITE_URL}/rencontrons-garanches/decouvrir-les-vignes)
- [Le domaine](${SITE_URL}/le-lieu/le-domaine)
- [L'histoire](${SITE_URL}/le-lieu/histoire)
- [Contact](${SITE_URL}/contact)

## Contact

345 chemin de Garanches, 69460 Odenas, France. Ouvert du lundi au samedi, de 9h à 18h.
Téléphone : ${TELEPHONES.map((t) => `${t.nom} ${t.numero}`).join(", ")}.
`;
    return new Response(texte, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
