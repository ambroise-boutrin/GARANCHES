"use client";

import { createContext, useContext, type ReactNode } from "react";
import { CONTENU_VIDE, type ContenuSite, type PhotoPrete } from "@/sanity/lib/contenuTypes";
import { photoDe, texteDe } from "@/lib/contenu";

export { Lignes } from "@/lib/contenu";
import { PORTES, type Porte } from "@/data/architecture";
import { TELEPHONES } from "@/data/contacts";
import { FAQS } from "@/data/faq";

// Contenu modifié dans le studio, lu une fois par le serveur et partagé avec tous les composants du navigateur.
const Contexte = createContext<ContenuSite>(CONTENU_VIDE);

export function ContenuProvider({ value, children }: { value: ContenuSite; children: ReactNode }) {
    return <Contexte.Provider value={value}>{children}</Contexte.Provider>;
}

export const useContenu = () => useContext(Contexte);

// Texte du site : celui du studio s'il existe, sinon celui prévu dans src/data/textes.ts.
export function useTexte(cle: string): string {
    return texteDe(useContenu(), cle);
}

export function usePhoto(cle: string): PhotoPrete {
    return photoDe(useContenu(), cle);
}

// Numéros du domaine (studio › Téléphones), sinon la liste du code.
export function useTelephones() {
    return useContenu().telephones ?? TELEPHONES;
}

// Questions fréquentes (studio › Questions fréquentes), sinon la liste du code.
export function useFaq() {
    return useContenu().faq ?? FAQS.map((f) => ({ question: f.question, reponse: f.answer }));
}

// Menus : noms et mots-clés des pages modifiés dans le studio.
export function usePortes(): Porte[] {
    const { pages } = useContenu();
    const chemin = (href: string) => href.replace(/^\//, "");
    return PORTES.map((porte) => ({
        ...porte,
        label: pages[chemin(porte.path)]?.titre ?? porte.label,
        children: porte.children.map((c) => ({
            ...c,
            label: pages[chemin(c.href)]?.titre ?? c.label,
            motsCles: pages[chemin(c.href)]?.motsCles ?? c.motsCles,
        })),
    }));
}

