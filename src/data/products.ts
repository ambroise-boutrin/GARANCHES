export const PRODUCTS = [
    {
        id: "brouilly",
        name: "Brouilly",
        subtitle: "Cru du Beaujolais — Rouge",
        price: 1200,
        description: "Les Brouilly présentent des notes de fleurs et de fruits : rose, violette, framboise, et cassis. Au-delà de ces parfums qui constituent le plaisir du Brouilly, chaque année révèle sa personnalité.",
        image: "/images/36_brouilly-h.jpg",
        tags: ["Gamay", "Viandes rouges", "Fromages"],
        alcohol: "13%",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "cote-de-brouilly",
        name: "Côte de Brouilly",
        subtitle: "Cru du Beaujolais — Rouge",
        price: 1350,
        description: "Un vin racé et élégant, issu des pentes du Mont Brouilly. Il offre une structure plus minérale et des arômes complexes de fruits noirs et d'épices.",
        image: "/images/36_brouilly-h.jpg",
        tags: ["Gamay", "Gibier", "Garde"],
        alcohol: "13.5%",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "bourgogne-blanc",
        name: "Bourgogne Blanc",
        subtitle: "Chardonnay",
        price: 1050,
        description: "Le Chardonnay blanc développe de façon constante une palette aromatique fraiche et fruitée avec des arômes de poire, de pomme...",
        image: "/images/37_bourgogne-blanc-h.jpg",
        tags: ["Chardonnay", "Poissons", "Apéritif"],
        alcohol: "12.5%",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "rose",
        name: "Beaujolais-Villages",
        subtitle: "Rosé",
        price: 900,
        description: "Elaboré à partir du cepage Gamay c'est un vin frais, qui présentent de façon constante des notes de fleurs et de fruits, une robe aux reflets rose saumoné.",
        image: "/images/13_rose-h.jpg",
        tags: ["Frais", "Estival", "Grillades"],
        alcohol: "12.5%",
        volume: "75cl",
        allergens: "Contient des sulfites"
    },
    {
        id: "petillant",
        name: "Amours Pétillantes",
        subtitle: "Méthode Traditionnelle",
        price: 1100,
        description: "Un vin rosé rieur, effervescent qui danse dans les verres. Pour accompagner avec finesse et élégance tous vos succès.",
        image: "/images/32_petillan-h.jpg",
        tags: ["Bulles", "Dessert", "Fête"],
        alcohol: "11.5%",
        volume: "75cl",
        allergens: "Contient des sulfites"
    }
];

export function getProductPrice(id: string): number | null {
    const product = PRODUCTS.find(p => p.id === id);
    return product ? product.price : null;
}
