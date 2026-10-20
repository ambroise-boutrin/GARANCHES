"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { PORTES, GENERIC_PATHS } from "@/data/architecture";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { totalItems } = useCart();

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

    // Les trois portes, puis les entrées transversales.
    const navLinks = [
        ...PORTES.map((porte) => ({ name: porte.label, href: porte.path, children: porte.children })),
        { name: "Les Carnets", href: "/carnets", children: [] },
        { name: "Contact", href: "/contact", children: [] },
    ];
    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
                        <div key={link.href} className="relative group/menu">
                            <Link
                                href={link.href}
                                className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300 relative group py-2 ${isActive(link.href) ? "text-amber-500" : (useDarkText ? "text-stone-900 hover:text-amber-600" : "text-white hover:text-amber-400")
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isActive(link.href) ? "w-full" : ""} ${useDarkText ? "bg-stone-900" : "bg-amber-500"}`}></span>
                            </Link>
                            {link.children.length > 0 && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-focus-within/menu:opacity-100 group-focus-within/menu:visible transition-all duration-300">
                                    <div className="bg-stone-900/95 backdrop-blur-md rounded-lg shadow-xl py-3 min-w-[240px]">
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={`block px-5 py-2 text-sm font-serif transition-colors ${pathname === child.href ? "text-amber-500" : "text-white hover:text-amber-400"}`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}


                    <Link
                        href="/panier"
                        aria-label={`Panier${totalItems > 0 ? ` (${totalItems} article${totalItems > 1 ? 's' : ''})` : ''}`}
                        className={`relative group flex items-center justify-center w-10 h-10 transition-colors duration-300 ${useDarkText ? "text-stone-900 hover:text-amber-600" : "text-white hover:text-amber-400"}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Link>



                    <Link
                        href="/acheter"
                        // Couleur conditionnelle :
                        // - DarkMode (Page blanche sans scroll) : Texte Noir / Bord Noir
                        // - Scrolled ou Home : Texte Blanc / Bord Blanc (ou style "scrolled" spécifique si besoin)
                        className={`px-6 py-2 border text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-full ${useDarkText
                            ? "border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"
                            : "border-white text-white hover:bg-white hover:text-stone-900"
                            } ${scrolled ? "bg-transparent border-white text-white hover:!bg-white hover:!text-stone-900 hover:!border-white" : ""}`}
                    >
                        Acheter
                    </Link>
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
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-stone-900 z-[100] flex flex-col items-center justify-start pt-28"
                    >
                        <div className="flex flex-col items-center gap-6 overflow-y-auto max-h-full pb-16 w-full">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.08 }}
                                    className="text-center"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-1 text-3xl font-serif text-white hover:text-amber-500 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                    {link.children.length > 0 && (
                                        <div className="flex flex-col gap-1 mt-1">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-sm text-white/60 hover:text-amber-500 transition-colors"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}


                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link
                                    href="/panier"
                                    className="text-2xl font-serif text-white hover:text-amber-500 transition-colors flex items-center gap-2"
                                >
                                    Mon Panier
                                    {totalItems > 0 && (
                                        <span className="bg-amber-600 text-white text-sm px-2 py-0.5 rounded-full">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                            </motion.div>


                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8"
                            >
                                <Link
                                    href="/acheter"
                                    className="px-8 py-4 bg-amber-600 text-white uppercase tracking-widest text-sm font-bold"
                                >
                                    Acheter / Trouver Garanches
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
}
