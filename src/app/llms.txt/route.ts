import { stegaClean } from "next-sanity";
import { getGammes } from "@/lib/wines";
import { separeLieuDit } from "@/lib/wineSlug";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TELEPHONES, numeroInternational } from "@/data/contacts";
import type { Langue } from "@/lib/langue";

// Résumé du site pour les assistants IA (ChatGPT, Claude, Perplexity…), au format llms.txt :
// qui est le domaine, ses vins millésime par millésime, les pages utiles. Aucun prix.
// Le français d'abord, puis la version anglaise du site (adresses en /en), pour les questions posées en anglais.
export const revalidate = 3600;

export async function GET() {
    const [gammes, gammesEn] = await Promise.all([getGammes("fr"), getGammes("en")]);
    const propre = (t?: string) => stegaClean(String(t || "")).replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
    const listeVins = (liste: typeof gammes, langue: Langue) => liste
        .map((g) => {
            const base = `${SITE_URL}${langue === "en" ? "/en" : ""}/les-vins/cuvees/${g.slug}`;
            const millesimes = g.millesimes
                .map((w) => `- ${propre(w.name)} ${propre(w.millesime)} (${base}#${propre(w.millesime)})${langue === "en" ? ":" : " :"} ${propre(w.description)}`)
                .join("\n");
            const { lieuDit, reste } = separeLieuDit(g.subtitle);
            return `### ${propre(g.name)}${lieuDit ? ` ${propre(lieuDit)}` : ""}${reste ? ` — ${propre(reste)}` : ""}\n${millesimes}`;
        })
        .join("\n\n");
    const vins = listeVins(gammes, "fr");
    const vinsEn = listeVins(gammesEn, "en");
    const en = `${SITE_URL}/en`;

    const texte = `# ${SITE_NAME}

> Domaine viticole familial à Odenas (Beaujolais), au pied du Mont Brouilly. Vignerons indépendants, vendanges à la main. Vins : Brouilly, Beaujolais-Villages blanc et Bourgogne blanc. Pas de vente en ligne : les bouteilles se commandent auprès du domaine (formulaire de contact ou téléphone), avec expédition en France. Dégustations et visites des vignes au domaine, sur réservation.

## Les vins

${vins}

## Histoire

- Jean Buy : premier de la lignée familiale installé à Garanches, il participe à la collecte des doléances de 1789 et devient le premier maire d'Odenas en 1790. Une marqueterie datée de 1790 le représente. (${SITE_URL}/le-lieu/histoire#jean-buy)
- Emmanuel Bender (1840–1900) : juge de paix à Lyon, président de la Société régionale de viticulture de Lyon ; avec Victor Pulliat, l'un des premiers à reconstituer le vignoble du Beaujolais et du Mâconnais après le phylloxéra. (${SITE_URL}/le-lieu/histoire#emmanuel-bender)
- Émile Bender (1871–1953) : député puis sénateur du Rhône, coauteur de la loi Capus-Bender du 22 juillet 1927, aux fondements des appellations d'origine contrôlées. (${SITE_URL}/le-lieu/histoire#emile-bender)

## Pages utiles

- [Les cuvées](${SITE_URL}/les-vins/cuvees) : tous les vins et leurs millésimes
- [Commander](${SITE_URL}/acheter) : comment commander des bouteilles
- [Les tables d'hôtes](${SITE_URL}/rencontrons-garanches/les-rencontres) : 4 heures, de 8 à 14 personnes, 50 € par personne, 4 vins compris
- [Déguster au domaine](${SITE_URL}/rencontrons-garanches/deguster-au-domaine) : visite de la cave, 1 heure, 20 € par personne, 2 personnes minimum
- [Découvrir les vignes](${SITE_URL}/rencontrons-garanches/decouvrir-les-vignes) : visite de la vigne, 1 heure, 20 € par personne ; vigne et cave, 2 heures, 35 € par personne ; 2 personnes minimum
- [Le domaine](${SITE_URL}/le-lieu/le-domaine)
- [L'histoire](${SITE_URL}/le-lieu/histoire)
- [Contact](${SITE_URL}/contact)

## Contact

345 chemin de Garanches, 69460 Odenas, France. Ouvert du lundi au samedi, de 9h à 18h.
Téléphone : ${TELEPHONES.map((t) => `${t.nom} ${t.numero}`).join(", ")}.

---

# ${SITE_NAME} (English)

> Family wine estate in Odenas, in the Beaujolais (France), at the foot of Mont Brouilly. Independent winegrowers, hand harvesting. Wines: Brouilly, Beaujolais-Villages blanc and Bourgogne blanc. No online shop: bottles are ordered from the estate (contact form or phone) and shipped within France. Tastings and vineyard visits at the estate, booking recommended. The English version of the site is at ${en}.

## Wines

${vinsEn}

## History

- Jean Buy: the first of the family line to settle at Garanches; he took part in gathering the grievances of 1789 and became the first mayor of Odenas in 1790. A marquetry dated 1790 shows him. (${en}/le-lieu/histoire#jean-buy)
- Emmanuel Bender (1840–1900): justice of the peace in Lyon and president of the Lyon Regional Viticulture Society; with Victor Pulliat, one of the first to replant the vineyards of the Beaujolais and the Mâconnais after phylloxera. (${en}/le-lieu/histoire#emmanuel-bender)
- Émile Bender (1871–1953): member of parliament then senator for the Rhône, co-author of the Capus-Bender law of 22 July 1927, which laid the foundations of the AOC system. (${en}/le-lieu/histoire#emile-bender)

## Useful pages

- [Our cuvées](${en}/les-vins/cuvees): all the wines and their vintages
- [Order](${en}/acheter): how to order bottles
- [Shared tables](${en}/rencontrons-garanches/les-rencontres): 4 hours, 8 to 14 people, €50 per person, 4 wines included
- [Wine tasting at the estate](${en}/rencontrons-garanches/deguster-au-domaine): cellar tour, 1 hour, €20 per person, 2 people minimum
- [Vineyard walk](${en}/rencontrons-garanches/decouvrir-les-vignes): vineyard tour, 1 hour, €20 per person; vineyard and cellar, 2 hours, €35 per person; 2 people minimum
- [The estate](${en}/le-lieu/le-domaine)
- [History](${en}/le-lieu/histoire)
- [Contact](${en}/contact)

## Contact

345 chemin de Garanches, 69460 Odenas, France. Open Monday to Saturday, 9 am to 6 pm.
Phone: ${TELEPHONES.map((t) => `${t.nom} ${numeroInternational(t.numero)}`).join(", ")}.
`;
    return new Response(texte, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
