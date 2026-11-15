"use client";

import { createContext, useContext, type ReactNode } from "react";
import { CONTENU_VIDE, type ContenuSite, type PhotoPrete } from "@/sanity/lib/contenuTypes";
import { photoDe, texteDe } from "@/lib/contenu";

export { Lignes } from "@/lib/contenu";
import { portesDe, type Porte } from "@/data/architecture";
import { TELEPHONES, numeroInternational, rangPrincipal } from "@/data/contacts";
import { FAQS } from "@/data/faq";
import { FAQS_EN } from "@/i18n/en/divers";
import { UI } from "@/i18n/ui";
import { lienLangue, type Langue } from "@/lib/langue";

// Contenu modifié dans le studio, lu une fois par le serveur et partagé avec tous les composants du navigateur.
const Contexte = createContext<ContenuSite>(CONTENU_VIDE);

export function ContenuProvider({ value, children }: { value: ContenuSite; children: ReactNode }) {
    return <Contexte.Provider value={value}>{children}</Contexte.Provider>;
}

export const useContenu = () => useContext(Contexte);

// Langue de la page (fr ou en).
export const useLangue = (): Langue => useContenu().langue;

// Mots fixes de l'interface dans la langue de la page.
export const useUi = () => UI[useLangue()];

// Adresse d'une page du site dans la langue de la page : "/contact" → "/en/contact" en anglais.
export function useLien() {
    const langue = useLangue();
    return (href: string) => lienLangue(href, langue);
}

// Texte du site : celui du studio s'il existe, sinon celui prévu dans src/data/textes.ts.
export function useTexte(cle: string): string {
    return texteDe(useContenu(), cle);
}

export function usePhoto(cle: string): PhotoPrete {
    return photoDe(useContenu(), cle);
}

// Numéros du domaine (studio › Téléphones), sinon la liste du code.
export function useTelephones() {
    const { telephones, langue } = useContenu();
    const liste = telephones ?? TELEPHONES;
    // Isabelle et Aurélie d'abord, quel que soit l'ordre saisi dans le studio.
    const triee = [...liste].sort((a, b) => rangPrincipal(a.nom) - rangPrincipal(b.nom));
    // En anglais, numéros au format international (+33 6 …), utilisables depuis l'étranger.
    return langue === "en" ? triee.map((t) => ({ ...t, numero: numeroInternational(t.numero) })) : triee;
}

// Questions fréquentes (studio › Questions fréquentes), sinon la liste du code.
export function useFaq() {
    const { faq, langue } = useContenu();
    return faq ?? (langue === "en" ? FAQS_EN : FAQS).map((f) => ({ question: f.question, reponse: f.answer }));
}

// Menus : noms et mots-clés des pages modifiés dans le studio.
export function usePortes(): Porte[] {
    const { pages, langue } = useContenu();
    const chemin = (href: string) => href.replace(/^\//, "");
    return portesDe(langue).map((porte) => ({
        ...porte,
        label: pages[chemin(porte.path)]?.titre ?? porte.label,
        children: porte.children.map((c) => ({
            ...c,
            label: pages[chemin(c.href)]?.titre ?? c.label,
            motsCles: pages[chemin(c.href)]?.motsCles ?? c.motsCles,
        })),
    }));
}

