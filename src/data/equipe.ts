// Rôle affiché sous chaque portrait (document d'Ambroise du 23/11/2026).
// Repris de l'ancienne page « Notre histoire ». Modifiable dans le studio (Équipe).
export const TEAM = [
    { name: "Michel Stagnara", role: "Les projets", roleEn: "Projects", image: "/images/1_image.jpg" },
    { name: "Isabelle Stagnara", role: "La gestion quotidienne", roleEn: "Day-to-day management", image: "/images/22_image.jpg" },
    { name: "Romain Martinache", role: "L'ampélologie", roleEn: "Ampelology", image: "/images/smugmug/romain-martinache.jpg" },
    { name: "Aurélie Crozet", role: "L'œnologie", roleEn: "Oenology", image: "/images/smugmug/aurelie-crozet.jpg" },
    { name: "Laetitia Stagnara", role: "Les relations publiques", roleEn: "Public relations", image: "/images/4_image.jpg" },
    { name: "Tancrède Stagnara", role: "L'international", roleEn: "International", image: "/images/15_image.jpg" },
    { name: "Ambroise Stagnara", role: "L'agronomie", roleEn: "Agronomy", image: "/images/26_image.jpg" },
];

// Rôle d'une personne quand le studio n'en donne pas : retrouvé par son prénom.
export function roleParDefaut(nom: string, langue: "fr" | "en") {
    const prenom = nom.trim().split(/\s+/)[0]?.toLowerCase();
    const p = TEAM.find((m) => m.name.split(" ")[0].toLowerCase() === prenom);
    return p ? (langue === "en" ? p.roleEn : p.role) : undefined;
}
