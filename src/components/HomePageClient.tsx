"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import AddToCartButton from "@/components/AddToCartButton";
import { PAGES, CARNETS_INTRO } from "@/data/architecture";

const PORTES = [
    { path: "le-lieu", image: "/images/23_slide002.jpg" },
    { path: "les-vins", image: "/images/34_slide001.jpg" },
    { path: "rencontrons-garanches", image: "/images/40_image.jpg" },
].map((p) => ({ ...p, page: PAGES[p.path] }));

export default function HomePageClient({ products }: { products: any[] }) {
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.classList.add("overflow-hidden");

        const isPWA = window.matchMedia('(display-mode: standalone)').matches;

        const startAnimation = () => {
            setIsLoading(false);
            document.body.classList.remove("overflow-hidden");
            sessionStorage.setItem("intro-played", "true");
            window.dispatchEvent(new Event("intro-complete"));
        };

        const hasPlayedIntro = sessionStorage.getItem("intro-played");

        if (hasPlayedIntro || isPWA) {
            setIsLoading(false);
            document.body.classList.remove("overflow-hidden");
            return;
        }

        const hasConfirmed = localStorage.getItem("age-confirmed");

        if (hasConfirmed) {
            startAnimation();
        } else {
            const handleAgeConfirmed = () => {
                startAnimation();
            };

            window.addEventListener("age-gate-confirmed", handleAgeConfirmed);

            const safetyTimeout = setTimeout(() => {
                setIsLoading(false);
                document.body.classList.remove("overflow-hidden");
            }, 5000);

            return () => {
                window.removeEventListener("age-gate-confirmed", handleAgeConfirmed);
                clearTimeout(safetyTimeout);
            };
        }
    }, []);

    const titleVariants = {
        loading: {
            scale: 1.1,
            y: 0,
            opacity: 1
        },
        loaded: {
            scale: 1,
            y: 0,
            opacity: 1
        }
    };

    return (
        <main className="min-h-screen text-gray-800 font-sans selection:bg-red-900 selection:text-white">

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="white-bg"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-[110] bg-[#FAFAFA]"
                    />
                )}
            </AnimatePresence>

            {/* BANDEAU LIVRAISON */}


            <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/34_slide001.jpg"
                        alt="Vignes du Domaine de Garanches s'étendant au pied du Mont Brouilly à Odenas"
                        fill
                        sizes="100vw"
                        className="object-cover brightness-75"
                        priority
                        quality={75}
                        fetchPriority="high"
                    />
                </div>

                <div className="relative text-center px-4 max-w-7xl mx-auto flex flex-col items-center pt-24 md:pt-20">
                    {mounted && (
                        <motion.h1
                            initial="loading"
                            animate={isLoading ? "loading" : "loaded"}
                            variants={titleVariants}
                            transition={{
                                duration: 1.5,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className={`font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight text-center relative transition-colors duration-1000 ${isLoading ? "z-[120] text-red-900" : "z-[70] text-white"}`}
                        >
                            Domaine de <br />
                            <span className="italic">Garanches</span>
                        </motion.h1>
                    )}

                    <motion.div
                        animate={{ opacity: isLoading ? 0 : 1 }}
                        transition={{ duration: 1, delay: 1.6 }}
                        className="mb-8 mt-4"
                    >
                        <span className="uppercase tracking-[0.3em] text-[10px] md:text-sm text-amber-400 font-bold block">
                            Depuis 1788 — Odenas
                        </span>
                    </motion.div>

                    <motion.div
                        animate={{ opacity: isLoading ? 0 : 1 }}
                        transition={{ duration: 1, delay: 1.9 }}
                        className="mt-4 flex flex-col items-center"
                    >
                        <div className="w-16 h-0.5 md:w-24 md:h-1 bg-amber-500 mb-6"></div>

                        <p className="font-serif italic text-2xl md:text-3xl max-w-xl mb-10 leading-relaxed px-2 text-white">
                            Un lieu. Des vins. Une histoire à vivre.
                        </p>

                        <a
                            href="#portes"
                            className="w-[220px] px-8 py-3 bg-transparent hover:bg-white/10 text-white uppercase tracking-widest text-xs font-bold transition-all border border-white hover:scale-105 duration-300 rounded-full text-center backdrop-blur-sm"
                        >
                            Entrer
                        </a>
                    </motion.div>
                </div>
            </section>

            <section id="portes" className="scroll-mt-20 py-20 md:py-32 bg-stone-50">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn direction="up" className="text-center mb-16">
                        <span className="text-amber-700 font-serif italic text-xl md:text-2xl mb-2 block">Bienvenue à Garanches</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-wine-900 leading-tight">Trois portes pour entrer</h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8">
                        {PORTES.map(({ path, image, page }, index) => (
                            <FadeIn key={path} delay={0.1 + index * 0.15}>
                                <Link href={`/${path}`} className="group relative block h-[480px] md:h-[560px] rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src={image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover brightness-[.6] group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                                        <h3 className="text-4xl font-serif mb-3">{page.label}</h3>
                                        <p className="font-light text-white/90 leading-relaxed mb-6">{page.blocs[0].title}</p>
                                        <span className="text-xs uppercase tracking-widest font-bold text-amber-400">{page.cta} →</span>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12 md:mb-20">
                        <FadeIn direction="down">
                            <span className="text-amber-700 text-sm font-bold uppercase tracking-widest mb-4 block">Les Vins</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">Les cuvées</h2>
                            <p className="max-w-2xl mx-auto text-gray-500 font-light leading-relaxed mb-8">
                                Du cep à votre verre, sans intermédiaire. Découvrez nos Crus du Beaujolais et nos vins de Bourgogne, élevés avec patience et passion. L'expression authentique de notre terroir, disponible en direct de la propriété.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* DYNAMIC PRODUCTS */}
                        {products.slice(0, 3).map((wine, index) => (
                            <FadeIn key={wine.id} delay={0.1 + index * 0.2} className="group flex flex-col h-full">
                                <Link href="/les-vins/cuvees" className="flex-grow">
                                    <div className="relative h-[400px] md:h-[500px] overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-8 border border-transparent hover:border-gray-100 transition-colors rounded-sm">
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-10 duration-500"></div>
                                        <Image
                                            src={wine.image || "/images/36_brouilly-h.jpg"}
                                            alt={`${wine.name} - Domaine de Garanches`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            loading="lazy"
                                            quality={75}
                                            className="object-contain transition-transform duration-700 group-hover:scale-110 p-4"
                                        />
                                        {/* Badge Best Seller artificiel pour l'exemple (optionnel) */}
                                        {index === 1 && (
                                            <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                                Cœur de Gamme
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center px-4">
                                        <h3 className="text-2xl md:text-3xl font-serif text-gray-900 group-hover:text-red-900 transition-colors">
                                            {wine.name}
                                        </h3>
                                        <div className="h-[1px] w-10 bg-gray-300 mx-auto my-4 group-hover:bg-red-900 transition-colors"></div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">
                                            {wine.subtitle || "Vin du Domaine"}
                                        </p>
                                        <p className="text-xl font-bold text-amber-700 mb-4">
                                            {(wine.price / 100).toFixed(2).replace('.', ',')} €
                                        </p>
                                    </div>
                                </Link>

                                {/* Add to Cart Button directly on Home */}
                                <div className="mt-auto px-8 pb-8 flex justify-center w-full">
                                    <AddToCartButton wine={wine} />
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <div className="mt-16 md:mt-20 text-center">
                        <Link
                            href="/les-vins/cuvees"
                            className="inline-block px-8 py-3 md:px-12 md:py-4 border border-gray-900 text-gray-900 uppercase tracking-widest text-xs font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-full"
                        >
                            Voir les cuvées
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-wine-900 text-white text-center px-6">
                <FadeIn direction="up" className="max-w-2xl mx-auto">
                    <span className="text-amber-400 font-serif italic text-xl mb-2 block">Les Carnets de Garanches</span>
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">{CARNETS_INTRO.title}</h2>
                    <p className="font-light text-white/80 leading-relaxed mb-10 whitespace-pre-line">{CARNETS_INTRO.body}</p>
                    <Link
                        href="/carnets"
                        className="inline-block px-10 py-3 border border-white text-white uppercase tracking-widest text-xs font-bold rounded-full hover:bg-white hover:text-wine-900 transition-colors"
                    >
                        Voir les Carnets
                    </Link>
                </FadeIn>
            </section>

        </main>
    );
}
