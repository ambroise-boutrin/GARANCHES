"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import ParallaxImage from "@/components/ParallaxImage";
import RequestBottlesButton from "@/components/RequestBottlesButton";
import { HOME_PORTES, SIGNATURE, HERO_VIDEO } from "@/data/architecture";
import { cuveeHref } from "@/lib/wineSlug";
import { cadrage } from "@/data/cadrages";

export default function HomePageClient({ products, content }: { products: any[], content?: any }) {
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const heroVideo = content?.hero?.videoUrl || HERO_VIDEO;

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
                        src="/images/garanches/video-accueil.jpg"
                        alt="Vignes du Domaine de Garanches s'étendant au pied du Mont Brouilly à Odenas"
                        fill
                        sizes="100vw"
                        className="object-cover brightness-75"
                        priority
                        quality={75}
                        fetchPriority="high"
                    />
                    {heroVideo && (
                        // La photo reste en dessous : elle s'affiche le temps du chargement et si le mouvement est réduit.
                        <video
                            className="absolute inset-0 h-full w-full object-cover brightness-75 motion-reduce:hidden"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            poster="/images/garanches/video-accueil.jpg"
                            aria-hidden="true"
                        >
                            {/* Sur téléphone, une version 720p plus légère ; sur ordinateur, la vidéo en 1080p. */}
                            {HERO_VIDEO && heroVideo === HERO_VIDEO && <source src={HERO_VIDEO.replace(/\.mp4$/, "-mobile.mp4")} type="video/mp4" media="(max-width: 767px)" />}
                            <source src={heroVideo} type="video/mp4" />
                        </video>
                    )}
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
                            Odenas — Mont Brouilly
                        </span>
                    </motion.div>

                    <motion.div
                        animate={{ opacity: isLoading ? 0 : 1 }}
                        transition={{ duration: 1, delay: 1.9 }}
                        className="mt-4 flex flex-col items-center"
                    >
                        <div className="w-16 h-0.5 md:w-24 md:h-1 bg-amber-500 mb-6"></div>

                        <p className="text-sm md:text-lg font-light max-w-xl mb-6 text-gray-100 leading-relaxed px-2 text-white">
                            {content?.hero?.content || "À Odenas, au pied du Mont Brouilly, Garanches est un lieu façonné par le temps, le granit et les générations qui l'ont fait vivre."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center w-full">
                            <Link
                                href="/les-vins/cuvees"
                                className="w-[260px] px-8 py-3 bg-red-900/90 hover:bg-red-800 text-white uppercase tracking-widest text-xs font-bold transition-all border border-red-900 duration-300 text-center shadow-lg"
                            >
                                Découvrir les vins
                            </Link>
                            <Link
                                href="/rencontrons-garanches"
                                className="w-[260px] px-8 py-3 bg-transparent hover:bg-white/10 text-white uppercase tracking-widest text-xs font-bold transition-all border border-white duration-300 text-center backdrop-blur-sm"
                            >
                                Rencontrons-nous
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section id="portes" className="scroll-mt-20 py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn direction="up" className="text-center mb-16">
                        <span className="text-amber-700 font-serif italic text-xl md:text-2xl mb-2 block">Garanches</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-red-900 leading-tight mb-6">{SIGNATURE}</h2>
                        <div className="w-24 h-1 bg-wine-900 mx-auto opacity-20"></div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8">
                        {HOME_PORTES.map(({ path, image, page, entrees }, index) => (
                            <FadeIn key={path} delay={0.1 + index * 0.15} className="flex flex-col">
                                <Link href={`/${path}`} className="group relative block h-[380px] rounded-t-lg overflow-hidden">
                                    <Image
                                        src={image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        style={{ objectPosition: cadrage(image) }}
                                        className="object-cover brightness-[.6] group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                                        <h3 className="text-4xl font-serif mb-3">{page.label}</h3>
                                        <span className="text-xs uppercase tracking-widest font-bold text-amber-400">{page.cta} →</span>
                                    </div>
                                </Link>
                                <div className="bg-stone-50 border border-t-0 border-stone-200 rounded-b-lg p-6 space-y-5 flex-grow">
                                    {entrees.map((entree) => (
                                        <Link key={entree.label} href={entree.href} className="group block">
                                            <span className="block text-xl font-serif text-wine-900 group-hover:text-amber-700 transition-colors">{entree.label}</span>
                                            <span className="block text-xs text-gray-500 tracking-wide mt-1">{entree.motsCles}</span>
                                        </Link>
                                    ))}
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-stone-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <FadeIn direction="right">
                        <div>
                            <span className="text-amber-700 font-serif italic text-xl md:text-2xl mb-2 block">Le Lieu</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-red-900 mb-6 md:mb-8 leading-tight">Une histoire <br />qui continue.</h2>
                            <div className="text-gray-600 leading-loose text-base md:text-lg font-light mb-8 space-y-4">
                                {content?.philosophy?.content ? (
                                    <p>{content.philosophy.content}</p>
                                ) : (
                                    <>
                                        <p>
                                            Garanches porte une histoire qui dépasse largement celle d'une propriété. Des hommes et des femmes y ont travaillé, réfléchi, transmis et parfois dû inventer pour que la vigne puisse continuer.
                                        </p>
                                        <p>
                                            Ici, le granit se décline du bleu au rose, et les générations de vignes se côtoient : certaines ont près de 150 ans, d'autres n'ont que quelques années. Nous les regardons vivre au fil des saisons, avec ce qu'elles portent du passé et ce qu'elles promettent pour demain.
                                        </p>
                                    </>
                                )}
                            </div>
                            <Link href="/le-lieu/histoire" className="group inline-flex items-center text-red-900 uppercase text-xs font-bold tracking-widest hover:text-amber-600 transition-colors">
                                <span className="border-b border-red-900 pb-1 group-hover:border-amber-600">Lire l'histoire</span>
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <div className="h-[500px] w-full relative">
                            <ParallaxImage
                                src="/images/23_slide002.jpg"
                                alt="Grappe de raisin Gamay du Beaujolais sur cep de vigne"
                                className="h-full w-full rounded-lg shadow-xl"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </FadeIn>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-stone-100">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn direction="up" className="text-center mb-16">
                        <span className="text-amber-700 font-serif italic text-xl mb-2 block">Les Vins</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-wine-900 mb-6">Des vins qui viennent d'un lieu.</h2>
                        <div className="w-24 h-1 bg-wine-900 mx-auto opacity-20"></div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-12">
                        <FadeIn delay={0.1} className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
                            <h3 className="text-2xl font-serif text-wine-900 mb-4">Le Gamay</h3>
                            <p className="text-gray-600 font-light leading-relaxed text-sm">
                                Le cépage du Beaujolais. Sur notre granit du Mont Brouilly, il donne des Brouilly de fruits rouges et noirs, droits et minéraux.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.2} className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
                            <h3 className="text-2xl font-serif text-wine-900 mb-4">Le Chardonnay</h3>
                            <p className="text-gray-600 font-light leading-relaxed text-sm">
                                Sur quelques parcelles argilo-calcaires choisies, il donne un Bourgogne blanc floral, aux notes d'agrumes et de fleurs blanches.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3} className="bg-white p-8 rounded-lg shadow-sm border border-stone-200">
                            <h3 className="text-2xl font-serif text-wine-900 mb-4">Notre façon de faire</h3>
                            <p className="text-gray-600 font-light leading-relaxed text-sm">
                                Vignerons indépendants, certifiés HVE. Rangs enherbés, sols travaillés, vendanges à la main : nous suivons la vigne au fil des saisons.
                            </p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12 md:mb-20">
                        <FadeIn direction="down">
                            <span className="text-amber-700 font-serif italic text-xl md:text-2xl mb-2 block">Les cuvées</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">Nos vins</h2>
                            <p className="max-w-2xl mx-auto text-gray-500 font-light leading-relaxed mb-8">
                                Des vins précis, vivants, en petites quantités. Ils partent directement de notre cave à Odenas, partout en France.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* DYNAMIC PRODUCTS */}
                        {products.slice(0, 3).map((wine, index) => (
                            <FadeIn key={wine.id} delay={0.1 + index * 0.2} className="group flex flex-col h-full">
                                <Link href={cuveeHref(wine)} className="flex-grow">
                                    <div className="relative h-[220px] sm:h-[320px] md:h-[500px] overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4 md:p-8 border border-transparent hover:border-gray-100 transition-colors rounded-sm">
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

                                {/* Demande de bouteilles via le formulaire de contact */}
                                <div className="mt-auto px-4 md:px-8 pb-4 md:pb-8 flex justify-center w-full">
                                    <RequestBottlesButton wine={wine} />
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <div className="mt-16 md:mt-20 text-center">
                        <Link
                            href="/les-vins/cuvees"
                            className="inline-block px-8 py-3 md:px-12 md:py-4 border border-gray-900 text-gray-900 uppercase tracking-widest text-xs font-bold hover:bg-gray-900 hover:text-white transition-all duration-300"
                        >
                            Voir toutes les cuvées
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
