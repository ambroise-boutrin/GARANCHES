import { CARNET_THEMES } from "@/data/architecture";

export function formatDate(date?: string) {
    return date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
}

export function themeLabel(theme?: string) {
    return CARNET_THEMES.find((t) => t.value === theme)?.title;
}
