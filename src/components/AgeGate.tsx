"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "@/components/Lien";
import { usePathname } from "next/navigation";
import { calculerAge, trancheDe } from "@/data/tranchesAge";
import { useUi } from "@/components/Contenu";
import { sansLangue } from "@/lib/langue";

type Champ = "jour" | "mois" | "annee";
const LONGUEUR: Record<Champ, number> = { jour: 2, mois: 2, annee: 4 };
const SUIVANT: Partial<Record<Champ, Champ>> = { jour: "mois", mois: "annee" };
// Pages consultables sans vérification, pour lire les mentions avant d'entrer.
const PAGES_LIBRES = ["/politique-confidentialite", "/mentions-legales"];

export default function AgeGate() {

    // Chemin sans /en : les pages libres sont les mêmes dans les deux langues.
    const pathname = sansLangue(usePathname() || "/");
    const ui = useUi();
    const [isVisible, setIsVisible] = useState(true);
    const [date, setDate] = useState<Record<Champ, string>>({ jour: "", mois: "", annee: "" });
    const [erreur, setErreur] = useState("");
    const [mineur, setMineur] = useState(false);
    const refs = {
        jour: useRef<HTMLInputElement>(null),
        mois: useRef<HTMLInputElement>(null),
        annee: useRef<HTMLInputElement>(null),
    };

    useEffect(() => {
        // Âge déjà confirmé : classe posée par le script du <head>, ou (pages rendues dans le navigateur,
        // comme la page introuvable) cookie et mémoire du navigateur relus ici.
        let deja = document.documentElement.classList.contains("age-ok") || document.cookie.includes("age-confirmed=true");
        try { deja = deja || Boolean(localStorage.getItem("age-confirmed")); } catch { }
        if (deja) setIsVisible(false);
    }, []);

    useEffect(() => {

        if (isVisible && !PAGES_LIBRES.includes(pathname)) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }


        const handlePageHide = () => {
            document.body.classList.remove("overflow-hidden");
        };
        window.addEventListener("pagehide", handlePageHide);


        return () => {
            document.body.classList.remove("overflow-hidden");
            window.removeEventListener("pagehide", handlePageHide);
        };
    }, [isVisible, pathname]);

    const changer = (champ: Champ, valeur: string) => {
        const chiffres = valeur.replace(/\D/g, "").slice(0, LONGUEUR[champ]);
        setDate((d) => ({ ...d, [champ]: chiffres }));
        setErreur("");
        const suivant = SUIVANT[champ];
        if (suivant && chiffres.length === LONGUEUR[champ]) refs[suivant].current?.focus();
    };

    const retour = (champ: Champ, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Backspace" || date[champ] !== "") return;
        const precedent = (Object.keys(SUIVANT) as Champ[]).find((c) => SUIVANT[c] === champ);
        if (precedent) refs[precedent].current?.focus();
    };

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();

        const age = calculerAge(Number(date.jour), Number(date.mois), Number(date.annee));
        if (date.annee.length !== 4 || age === null) {
            setErreur(ui.dateInvalide);
            return;
        }
        if (age < 18) {
            setMineur(true);
            return;
        }

        // Seule la tranche d'âge part au serveur, de façon anonyme. La date de naissance n'est pas conservée.
        const tranche = trancheDe(age);
        if (tranche) {
            fetch("/api/tranche-age", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tranche }),
                keepalive: true,
            }).catch(() => {});
        }

        document.cookie = "age-confirmed=true; path=/; max-age=31536000; SameSite=Lax";


        localStorage.setItem("age-confirmed", "true");


        window.dispatchEvent(new Event("age-gate-confirmed"));

        setIsVisible(false);
    };

    const champ = (nom: Champ, placeholder: string, label: string, largeur: string) => (
        <label className={`flex flex-col items-center gap-2 ${largeur}`}>
            <input
                ref={refs[nom]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={nom === "jour" ? "bday-day" : nom === "mois" ? "bday-month" : "bday-year"}
                maxLength={LONGUEUR[nom]}
                value={date[nom]}
                onChange={(e) => changer(nom, e.target.value)}
                onKeyDown={(e) => retour(nom, e)}
                placeholder={placeholder}
                aria-label={label}
                aria-invalid={erreur !== ""}
                className="w-full bg-transparent border-b border-stone-400 focus:border-white outline-none text-center text-white text-2xl font-serif tracking-[0.15em] py-2 placeholder:text-stone-400 transition-colors"
            />
            <span className="text-sm text-stone-400">{label}</span>
        </label>
    );

    return (
        <AnimatePresence>
            {isVisible && !PAGES_LIBRES.includes(pathname) && (
                <motion.div

                    data-age-gate
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#1c1917] px-6 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="age-gate-title"
                >
                    <div className="text-center w-full max-w-sm relative z-10 py-10">
                        <div className="mb-6 sm:mb-8 relative h-16 w-[122px] sm:h-20 sm:w-[152px] mx-auto">
                            <Image src="/images/logo-maison.png" alt={ui.logo} fill sizes="152px" className="object-contain opacity-80" priority unoptimized />
                        </div>

                        <motion.div
                        >
                            <div id="age-gate-title" className="text-3xl font-serif text-white mb-2 uppercase tracking-[0.04em]">{ui.bienvenue}</div>
                            <div className="w-16 h-px bg-white/60 mx-auto mb-6"></div>

                            {mineur ? (
                                <div role="alert">
                                    <p className="text-stone-300 leading-relaxed mb-10">
                                        {ui.mineur}
                                    </p>
                                    <a
                                        href="https://www.google.com"
                                        className="text-stone-400 text-sm underline underline-offset-4 hover:text-white transition-colors"
                                    >
                                        {ui.quitter}
                                    </a>
                                </div>
                            ) : (
                                <form onSubmit={handleConfirm} noValidate>
                                    <p className="text-stone-300 mb-8 leading-relaxed">
                                        {ui.ageConsigne}
                                    </p>

                                    <fieldset className="mb-3">
                                        <legend className="sr-only">{ui.dateNaissance}</legend>
                                        <div className="flex items-start justify-center gap-4">
                                            {champ("jour", ui.jourCourt, ui.jour, "w-14")}
                                            {champ("mois", ui.moisCourt, ui.mois, "w-14")}
                                            {champ("annee", ui.anneeCourt, ui.annee, "w-24")}
                                        </div>
                                    </fieldset>

                                    <p className="min-h-[1.5rem] text-white text-sm mb-4" role="alert">{erreur}</p>

                                    <button
                                        type="submit"
                                        className="pointer-events-auto cursor-pointer w-full py-4 bg-white text-stone-900 text-base font-medium hover:bg-stone-200 transition-colors duration-300 relative z-50"
                                    >
                                        {ui.entrer}
                                    </button>

                                    <p className="mt-6 text-[11px] leading-relaxed text-stone-400">
                                        {ui.ageViePrivee}{" "}
                                        <Link href="/politique-confidentialite#tranches-age" className="underline underline-offset-2 hover:text-stone-300">
                                            {ui.enSavoirPlus}
                                        </Link>
                                    </p>

                                    <a
                                        href="https://www.google.com"
                                        className="inline-block pointer-events-auto cursor-pointer text-stone-400 text-sm underline underline-offset-4 hover:text-white transition-colors mt-6 relative z-50"
                                    >
                                        {ui.quitter}
                                    </a>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
