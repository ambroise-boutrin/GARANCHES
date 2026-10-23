"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { calculerAge, trancheDe } from "@/data/tranchesAge";

type Champ = "jour" | "mois" | "annee";
const LONGUEUR: Record<Champ, number> = { jour: 2, mois: 2, annee: 4 };
const SUIVANT: Partial<Record<Champ, Champ>> = { jour: "mois", mois: "annee" };
// Pages consultables sans vérification, pour lire les mentions avant d'entrer.
const PAGES_LIBRES = ["/politique-confidentialite", "/mentions-legales"];

export default function AgeGate() {

    const pathname = usePathname();
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
        if (document.documentElement.classList.contains("age-ok")) setIsVisible(false);
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
            setErreur("Cette date ne semble pas valide.");
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
                className="w-full bg-transparent border-b border-stone-600 focus:border-white outline-none text-center text-white text-2xl font-serif tracking-[0.15em] py-2 placeholder:text-stone-600 transition-colors"
            />
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">{label}</span>
        </label>
    );

    return (
        <AnimatePresence>
            {isVisible && !PAGES_LIBRES.includes(pathname) && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}

                    data-age-gate
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#1c1917] px-6 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="age-gate-title"
                >
                    <div className="text-center w-full max-w-sm relative z-10 py-10">
                        <div className="mb-6 sm:mb-8 relative h-20 w-20 sm:h-24 sm:w-24 mx-auto">
                            <Image src="/images/17_logo.png" alt="Logo" fill className="object-contain opacity-80" priority />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <div id="age-gate-title" className="text-3xl font-serif text-white mb-2">Bienvenue au Domaine</div>
                            <div className="w-16 h-px bg-white/60 mx-auto mb-6"></div>

                            {mineur ? (
                                <div role="alert">
                                    <p className="text-stone-300 leading-relaxed mb-10">
                                        L'accès à ce site est réservé aux personnes majeures. Nous serons heureux de vous accueillir plus tard.
                                    </p>
                                    <a
                                        href="https://www.google.com"
                                        className="text-stone-400 text-xs uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Quitter le site
                                    </a>
                                </div>
                            ) : (
                                <form onSubmit={handleConfirm} noValidate>
                                    <p className="text-stone-300 mb-8 leading-relaxed">
                                        L'accès à ce site est réservé aux personnes majeures. Merci d'indiquer votre date de naissance.
                                    </p>

                                    <fieldset className="mb-3">
                                        <legend className="sr-only">Date de naissance</legend>
                                        <div className="flex items-start justify-center gap-4">
                                            {champ("jour", "JJ", "Jour", "w-14")}
                                            {champ("mois", "MM", "Mois", "w-14")}
                                            {champ("annee", "AAAA", "Année", "w-24")}
                                        </div>
                                    </fieldset>

                                    <p className="min-h-[1.5rem] text-white text-sm mb-4" role="alert">{erreur}</p>

                                    <button
                                        type="submit"
                                        className="pointer-events-auto cursor-pointer w-full py-4 bg-white text-stone-900 uppercase tracking-[0.2em] text-xs font-bold hover:bg-amber-500 transition-colors duration-300 relative z-50"
                                    >
                                        Entrer
                                    </button>

                                    <p className="mt-6 text-[11px] leading-relaxed text-stone-500">
                                        Votre date de naissance n'est pas conservée. Seule votre tranche d'âge est comptée, de façon anonyme, pour mieux connaître nos visiteurs.{" "}
                                        <Link href="/politique-confidentialite#tranches-age" className="underline underline-offset-2 hover:text-stone-300">
                                            En savoir plus
                                        </Link>
                                    </p>

                                    <a
                                        href="https://www.google.com"
                                        className="inline-block pointer-events-auto cursor-pointer text-stone-500 text-xs uppercase tracking-widest hover:text-white transition-colors mt-6 relative z-50"
                                    >
                                        Quitter le site
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
