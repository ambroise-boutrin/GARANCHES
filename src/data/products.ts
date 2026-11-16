// Les vins du domaine, d'après la fiche tarif 2027. Une fiche par bouteille (nom + millésime).
// price en centimes ; jamais affiché sur le site, gardé pour la future boutique.
// Les textes servent avant le premier import dans Sanity, ou si Sanity ne répond pas : le studio fait foi.
export const PRODUCTS: {
    id: string; name: string; subtitle: string; millesime?: string; price: number | null; description: string;
    image: string; tags: string[]; alcohol?: string; volume: string; allergens: string; parcelle?: string; vinification?: string;
}[] = [
    {
        id: "brouilly",
        name: "Brouilly",
        subtitle: "Cru du Beaujolais — Rouge",
        millesime: "2023",
        price: 1200,
        description: "Un vin gourmand qui prend sa structure au fil du temps. Première cuvée de Romain et Aurélie sur Garanches.\n\nFramboise et figue fraîche prédominent au nez comme en bouche. Une belle attaque donnant l'impression de croquer dans un fruit. Les tanins sont soyeux et la longueur en bouche généreuse.",
        image: "/images/bouteilles/brouilly.jpg",
        tags: ["Gamay"],
        alcohol: "13 %",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "brouilly-2024",
        name: "Brouilly",
        subtitle: "Cru du Beaujolais — Rouge",
        millesime: "2024",
        price: null,
        description: "Un beau vin de garde.\n\nFramboises et fraises des bois prédominent au nez comme en bouche. Une belle attaque donne l'impression de croquer dans un fruit frais et acidulé. Les tanins sont soyeux et la longueur en bouche généreuse. La fraîcheur du millésime habille entièrement l'élevage sous bois, qui équilibre parfaitement les arômes.",
        vinification: "Ce Brouilly est élevé en plusieurs cuvées.\n\n**Cuvée Le musée**\nLe musée est une vieille vigne sur un sol sablonneux granitique, rose principalement. Cette caractéristique donne des vins plus tendus et plus frais, avec une bouche acidulée : fraise des bois, cassis, framboise. L'exposition au sud apporte une floraison plus précoce, des baies mûres plus rapidement et une richesse aromatique intense. L'ensoleillement et le sable donnent de la légèreté au vin et permettent de le déguster dans sa jeunesse.\n\n**Cuvée Le parc**\nLe parc est exposé à l'est, sur un sol plus argilo-granitique, ce qui donne au vin plus d'ampleur et de profondeur en bouche. Le fruit reste frais mais plus juteux, avec des parfums de cerise intense et d'épices douces et poivrées.\n\n**Cuvée Fûts, 24 mois d'élevage en demi-muid**\nUn nez généreux aux arômes de fruits noirs mûrs et de cerise juteuse, accompagné de délicates notes fumées et vanillées, relevées de nuances de café et de cacao. La bouche, ample et charnue, révèle une belle richesse fruitée. Le bois, parfaitement intégré, accompagne le vin avec élégance, sans masquer l'expression du fruit.",
        image: "/images/bouteilles/brouilly-2024.jpg",
        tags: ["Gamay"],
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "brouilly-2025",
        name: "Brouilly",
        subtitle: "Cru du Beaujolais — Rouge",
        millesime: "2025",
        price: null,
        description: "Un beau vin de garde.\n\nUn nez de fraises fraîchement écrasées et de petits fruits rouges. Une bouche solaire, pleine d’énergie, portée par une belle intensité et des tanins fins. La finale, fraîche et salivante, invite à prolonger la conversation… et le plaisir du partage.",
        image: "/images/bouteilles/brouilly.jpg",
        tags: ["Gamay"],
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "bourgogne-blanc",
        name: "Bourgogne blanc",
        subtitle: "Chardonnay",
        millesime: "2024",
        price: 1050,
        description: "Un vin digne des beaux Bourgognes que nous aimons.\n\nNez et bouche aux notes florales légèrement miellées, qui procurent une sensation de gras en bouche sur des notes de fruits blancs acidulés. Une finale longue sur des notes de torréfaction vanillées fait le plus grand charme de ce vin.",
        image: "/images/bouteilles/bourgogne-blanc.jpg",
        tags: ["Chardonnay"],
        alcohol: "12 %",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "bourgogne-blanc-2025",
        name: "Bourgogne blanc",
        subtitle: "Chardonnay",
        millesime: "2025",
        price: null,
        description: "Un millésime équilibré, qui donne au vin des notes de fruits exotiques proches de notre Bourgogne 2023.\n\nMiellé, suave et gourmand, les fleurs prédominent au nez comme en bouche. La poire, l'ananas et l'abricot, frais et légèrement acidulés, apportent de la complexité à la dégustation.",
        image: "/images/bouteilles/bourgogne-blanc.jpg",
        tags: ["Chardonnay"],
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "beaujolais-villages-blanc",
        name: "Beaujolais-Villages blanc",
        subtitle: "Beaujolais-Villages — Blanc",
        millesime: "2025",
        price: null,
        description: "Un vrai Beaujolais de printemps.\n\nLe Beaujolais-Villages blanc présente un équilibre attrayant, floral, fruité et acidulé, dû à la fraîcheur du millésime. Citron, acacia et fleurs d'aubépine sont l'identité même de ce vin, avec une finale fraîche et salivante.",
        image: "/images/bouteilles/beaujolais-villages-blanc.jpg",
        tags: [],
        alcohol: "12 %",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
];

export function getProductPrice(id: string): number | null {
    const product = PRODUCTS.find(p => p.id === id);
    return product ? product.price : null;
}
