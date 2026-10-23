"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PORTES, GENERIC_PATHS, type Porte } from "@/data/architecture";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";
    // Menu déroulant refermé après un clic, jusqu'à ce que la souris quitte l'onglet.
    const [menuFerme, setMenuFerme] = useState<string | null>(null);

    // Visibilité de la navbar :
    // - Sur Home : Cachée par défaut, s'affiche quand l'intro est finie
    // - Ailleurs : Toujours visible
    const [isVisible, setIsVisible] = useState(pathname !== "/");

    // Logique de couleur :
    // - Home : Blanc au début (sur fond sombre) -> Blanc au scroll (sur fond sombre)
    // - Autres : Noir au début (sur fond blanc) -> Blanc au scroll (sur fond sombre)
    // - Mobile Open : Toujours blanc (car l'overlay est sombre)
    // Les pages de l'arborescence ouvrent sur une grande photo sombre, comme l'accueil.
    const hasDarkHero = isHome || GENERIC_PATHS.includes(pathname.slice(1));
    const useDarkText = !hasDarkHero && !scrolled && !isOpen;

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isOpen]);

    useEffect(() => {
        if (isHome) {
            // Vérifier si l'intro a déjà été jouée
            const hasPlayed = sessionStorage.getItem("intro-played");
            if (hasPlayed) {
                setIsVisible(true);
            } else {
                // Sinon on attend l'événement de fin d'intro venant de page.tsx
                const handleIntroComplete = () => setIsVisible(true);
                window.addEventListener("intro-complete", handleIntroComplete);
                return () => window.removeEventListener("intro-complete", handleIntroComplete);
            }
        } else {
            setIsVisible(true);
        }
    }, [isHome]);

    // Détecter le scroll pour changer le fond de la navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fermer le menu mobile quand on change de page
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Les trois portes, puis Contact (les Carnets sont dans le sous-menu Le Lieu).
    const navLinks: { name: string; href: string; children: Porte["children"] }[] = [
        ...PORTES.map((porte) => ({ name: porte.label, href: porte.path, children: porte.children })),
        { name: "Contact", href: "/contact", children: [] },
    ];
    // Menu mobile : porte dont on affiche les pages (null = liste des portes).
    const [openPorte, setOpenPorte] = useState<string | null>(null);
    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
    const openPorteLink = navLinks.find((link) => link.href === openPorte && link.children.length > 0);
    // Le menu se rouvre toujours sur la liste des portes.
    useEffect(() => {
        if (!isOpen) setOpenPorte(null);
    }, [isOpen]);

    return (
        <nav
            className={`fixed w-full z-[100] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"} ${scrolled ? "bg-stone-900/95 backdrop-blur-md py-3 shadow-lg" : "bg-gradient-to-b from-black/50 to-transparent py-6"} ${isOpen ? "!h-screen !bg-stone-900" : ""
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">


                <Link href="/" className="relative z-[101] flex items-center gap-3 group">
                    <div className={`relative transition-all duration-500 ${scrolled ? "w-10 h-10" : "w-12 h-12"}`}>
                        <Image
                            src="/images/17_logo.png"
                            alt="Logo Domaine de Garanches"
                            fill
                            // Si useDarkText est vrai, on inverse les couleurs (White -> Black) pour qu'il soit visible sur fond blanc
                            className={`object-contain transition-all duration-300 ${useDarkText ? "invert" : ""}`}
                            sizes="48px"
                            priority
                            unoptimized
                        />
                    </div>
                    <span className={`font-serif tracking-widest uppercase font-bold transition-all duration-300 ${scrolled ? "text-sm" : "text-base"} ${useDarkText ? "text-stone-900" : "text-white"}`}>
                        Garanches
                    </span>
                </Link>


                <div className="hidden lg:flex items-center gap-7">
                    {navLinks.map((link) => (
                        <div key={link.href} className="relative group/menu" onMouseLeave={() => setMenuFerme(null)}>
                            <Link
                                href={link.href}
                                onClick={(e) => { e.currentTarget.blur(); setMenuFerme(link.href); }}
                                className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300 relative group py-2 ${useDarkText ? "text-stone-900" : "text-white"}
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isActive(link.href) ? "w-full" : ""} ${useDarkText ? "bg-stone-900" : "bg-white"}`}></span>
                            </Link>
                            {link.children.length > 0 && (
                                <div className={`absolute -left-5 top-full pt-4 opacity-0 invisible transition-opacity duration-200 ${menuFerme === link.href ? "" : "group-hover/menu:opacity-100 group-hover/menu:visible group-focus-within/menu:opacity-100 group-focus-within/menu:visible"}`}>
                                    <ul className="min-w-[230px] bg-stone-950/95 backdrop-blur-sm py-3">
                                        {link.children.map((child) => {
                                            const active = pathname === child.href;
                                            return (
                                                <li key={child.href}>
                                                    <Link
                                                        href={child.href}
                                                        onClick={(e) => { e.currentTarget.blur(); setMenuFerme(link.href); }}
                                                        className={`block px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] transition-colors ${active ? "text-white" : "text-white/80 hover:text-white"}`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}


                    <div className={`flex items-center gap-3 pl-7 border-l ${useDarkText ? "border-stone-300" : "border-white/30"}`}>
                        <Link
                            href="/acheter"
                            // Couleur conditionnelle :
                            // - DarkMode (Page blanche sans scroll) : Texte Noir / Bord Noir
                            // - Scrolled ou Home : Texte Blanc / Bord Blanc (ou style "scrolled" spécifique si besoin)
                            className={`px-6 py-2 border text-xs uppercase tracking-widest font-bold transition-all duration-300 ${useDarkText
                                ? "border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"
                                : "border-white text-white hover:bg-white hover:text-stone-900"
                                } ${scrolled ? "bg-transparent border-white text-white hover:!bg-white hover:!text-stone-900 hover:!border-white" : ""}`}
                        >
                            Commander
                        </Link>
                    </div>
                </div>


                <div className="lg:hidden flex items-center gap-5 z-[101]">



                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={isOpen}
                        className="relative w-10 h-10 flex flex-col justify-center items-end gap-1.5 group"
                    >
                        <span className={`h-0.5 rounded-full transition-all duration-300 ${useDarkText && !isOpen ? "bg-stone-900" : "bg-white"} ${isOpen ? "w-6 rotate-45 translate-y-2 bg-white" : "w-6"}`} />
                        <span className={`h-0.5 rounded-full transition-all duration-300 ${useDarkText && !isOpen ? "bg-stone-900" : "bg-white"} ${isOpen ? "opacity-0" : "w-4 group-hover:w-6"}`} />
                        <span className={`h-0.5 rounded-full transition-all duration-300 ${useDarkText && !isOpen ? "bg-stone-900" : "bg-white"} ${isOpen ? "w-6 -rotate-45 -translate-y-2 bg-white" : "w-6"}`} />
                    </button>
                </div>
            </div>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 bg-stone-900 z-[100] flex flex-col pt-24 overflow-hidden"
                    >
                        {/* Deux écrans : la liste des portes, puis les pages de la porte choisie. */}
                        <AnimatePresence mode="wait" initial={false}>
                            {openPorteLink ? (
                                <motion.div
                                    key={openPorteLink.href}
                                    initial={{ x: 40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 40, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 overflow-y-auto px-6 pb-10"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenPorte(null)}
                                        className="flex items-center gap-2 py-3 text-xs uppercase tracking-widest text-white/60"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        Menu
                                    </button>
                                    <Link
                                        href={openPorteLink.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block mt-2 mb-6"
                                    >
                                        <span className="block font-serif text-4xl text-white">{openPorteLink.name}</span>
                                        <span className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white">
                                            Voir la page
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </span>
                                    </Link>
                                    <ul className="border-t border-white/10">
                                        {openPorteLink.children.map((child) => (
                                            <li key={child.href} className="border-b border-white/10">
                                                <Link
                                                    href={child.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center justify-between gap-4 py-4"
                                                >
                                                    <span>
                                                        <span className={`block font-serif text-2xl ${pathname === child.href ? "text-white underline underline-offset-8 decoration-1" : "text-white/80"}`}>{child.label}</span>
                                                        {child.motsCles && <span className="block mt-1 text-xs text-white/50">{child.motsCles}</span>}
                                                    </span>
                                                    <svg className="w-4 h-4 shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="portes"
                                    initial={{ x: -40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -40, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 flex flex-col overflow-y-auto px-6 pb-10"
                                >
                                    <ul className="border-t border-white/10">
                                        {navLinks.map((link) => {
                                            const actif = isActive(link.href);
                                            const contenu = (
                                                <>
                                                    <span className={`font-serif text-3xl ${actif ? "text-white underline underline-offset-8 decoration-1" : "text-white"}`}>{link.name}</span>
                                                    <svg className="w-5 h-5 shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                </>
                                            );
                                            return (
                                                <li key={link.href} className="border-b border-white/10">
                                                    {link.children.length > 0 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setOpenPorte(link.href)}
                                                            aria-label={`Afficher les pages de ${link.name}`}
                                                            className="w-full flex items-center justify-between gap-4 py-5 text-left"
                                                        >
                                                            {contenu}
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={link.href}
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-center justify-between gap-4 py-5"
                                                        >
                                                            {contenu}
                                                        </Link>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <div className="mt-auto pt-10 space-y-6">
                                        <Link
                                            href="/acheter"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full py-4 text-center bg-white text-stone-900 uppercase tracking-widest text-xs font-bold"
                                        >
                                            Commander
                                        </Link>
                                        <p className="text-center text-xs text-white/50 leading-relaxed">
                                            345 chemin de Garanches, 69460 Odenas
                                            <br />
                                            <a href="tel:+33474034480" className="inline-block py-2 text-white/70">04 74 03 44 80</a>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
}
