import { carnetThemesDe } from "@/data/architecture";
import { CODE_LANGUE, type Langue } from "@/lib/langue";

export function formatDate(date?: string, langue: Langue = "fr") {
    return date ? new Date(date).toLocaleDateString(CODE_LANGUE[langue], { day: "numeric", month: "long", year: "numeric" }) : "";
}

export function themeLabel(theme?: string, langue: Langue = "fr") {
    return carnetThemesDe(langue).find((t) => t.value === theme)?.title;
}
