// Les trois vins du domaine. Le millésime suit l'étiquette en vente : à mettre à jour à chaque nouveau millésime.
// price en centimes ; null = aucun prix affiché.
export const PRODUCTS: {
    id: string; name: string; subtitle: string; millesime?: string; price: number | null; description: string;
    image: string; tags: string[]; alcohol: string; volume: string; allergens: string;
}[] = [
    {
        id: "brouilly",
        name: "Brouilly",
        subtitle: "Cru du Beaujolais — Rouge",
        millesime: "2023",
        price: 1200,
        description: "Les Brouilly présentent des notes de fleurs et de fruits : rose, violette, framboise, et cassis. Au-delà de ces parfums qui constituent le plaisir du Brouilly, chaque année révèle sa personnalité.",
        image: "/images/bouteilles/brouilly.jpg",
        tags: ["Gamay", "Viandes rouges", "Fromages"],
        alcohol: "13 %",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "beaujolais-villages-blanc",
        name: "Beaujolais-Villages blanc",
        subtitle: "Beaujolais-Villages — Blanc",
        millesime: "2025",
        price: null,
        description: "Le blanc du domaine en appellation Beaujolais-Villages.",
        image: "/images/bouteilles/beaujolais-villages-blanc.jpg",
        tags: ["Apéritif", "Poissons"],
        alcohol: "12 %",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "bourgogne-blanc",
        name: "Bourgogne Blanc",
        subtitle: "Chardonnay",
        millesime: "2024",
        price: 1050,
        description: "Le Chardonnay blanc développe de façon constante une palette aromatique fraiche et fruitée avec des arômes de poire, de pomme...",
        image: "/images/bouteilles/bourgogne-blanc.jpg",
        tags: ["Chardonnay", "Poissons", "Apéritif"],
        alcohol: "12 %",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
];

export function getProductPrice(id: string): number | null {
    const product = PRODUCTS.find(p => p.id === id);
    return product ? product.price : null;
}
