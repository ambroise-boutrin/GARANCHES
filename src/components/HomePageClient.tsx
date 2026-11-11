"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ParallaxImage from "@/components/ParallaxImage";
import RequestBottlesButton from "@/components/RequestBottlesButton";
import { HOME_PORTES, SIGNATURE, HERO_VIDEO } from "@/data/architecture";
import { cuveeHref } from "@/lib/wineSlug";
import { cadrage } from "@/data/cadrages";
import { prixAffiche } from "@/lib/prix";

export default function HomePageClient({ products, content }: { products: any[], content?: any }) {
    const heroVideo = content?.hero?.videoUrl || HERO_VIDEO;

    return (
        <main className="min-h-screen text-gray-800 font-sans selection:bg-red-900 selection:text-white">

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
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight text-center text-white">
                        Domaine de <br />
                        <span>Garanches</span>
                    </h1>

                    <div className="mb-8 mt-4">
                        <span className="text-sm md:text-base text-white block">
                            Odenas — Mont Brouilly
                        </span>
                    </div>

                    <div className="mt-4 flex flex-col items-center">

                        <p className="text-sm md:text-lg max-w-xl mb-6 text-gray-100 leading-relaxed px-2 text-white">
                            {content?.hero?.content || "À Odenas, au pied du Mont Brouilly, Garanches est un lieu façonné par le temps, le granit et les générations qui l'ont fait vivre."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center w-full">
                            <Link
                                href="/les-vins/cuvees"
                                className="w-[260px] px-8 py-3 bg-red-900/90 hover:bg-red-800 text-white text-base font-medium transition-colors border border-red-900 duration-300 text-center"
                            >
                                Découvrir les vins
                            </Link>
                            <Link
                                href="/rencontrons-garanches"
                                className="w-[260px] px-8 py-3 bg-transparent hover:bg-white/10 text-white text-base font-medium transition-colors border border-white duration-300 text-center"
                            >
                                Rencontrons-nous
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="portes" className="scroll-mt-20 py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn direction="up" className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif text-red-900 leading-tight mb-6">{SIGNATURE}</h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8">
                        {HOME_PORTES.map(({ path, image, page, entrees }, index) => (
                            <FadeIn key={path} delay={0.1 + index * 0.15} className="flex flex-col">
                                <Link href={`/${path}`} className="group relative block h-[380px] overflow-hidden">
                                    <Image
                                        src={image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        style={{ objectPosition: cadrage(image) }}
                                        className="object-cover brightness-[.6] group-hover:brightness-75 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                                        <h3 className="text-3xl md:text-4xl font-serif mb-3">{page.label}</h3>
                                        <span className="text-base text-white underline underline-offset-4 decoration-1">{page.cta}</span>
                                    </div>
                                </Link>
                                <div className="bg-stone-50 border border-t-0 border-stone-200 p-6 space-y-5 flex-grow">
                                    {entrees.map((entree) => (
                                        <Link key={entree.label} href={entree.href} className="group block">
                                            <span className="block text-xl font-serif text-wine-900 group-hover:text-red-900 transition-colors">{entree.label}</span>
                                            <span className="block text-xs text-gray-700 tracking-wide mt-1">{entree.motsCles}</span>
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
                            <h2 className="text-3xl md:text-5xl font-serif text-red-900 mb-6 md:mb-8 leading-tight">Une histoire <br />qui continue.</h2>
                            <div className="text-gray-800 leading-relaxed text-base md:text-lg mb-8 space-y-4">
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
                            <Link href="/le-lieu/histoire" className="group inline-flex items-center text-red-900 text-base hover:text-red-700 transition-colors">
                                <span className="border-b border-red-900 pb-1 group-hover:border-red-700">Lire l'histoire</span>
                            </Link>
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <div className="h-[500px] w-full relative">
                            <ParallaxImage
                                src="/images/23_slide002.jpg"
                                parallaxe
                                alt="Grappe de raisin Gamay du Beaujolais sur cep de vigne"
                                className="h-full w-full"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </FadeIn>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-stone-100">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn direction="up" className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-wine-900 mb-6">Des vins qui viennent d'un lieu.</h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-12">
                        <FadeIn delay={0.1} className="bg-white p-8 border border-stone-200">
                            <h3 className="text-2xl font-serif text-wine-900 mb-4">Le Gamay</h3>
                            <p className="text-gray-800 leading-relaxed text-sm">
                                Le cépage du Beaujolais. Sur notre granit du Mont Brouilly, il donne des Brouilly de fruits rouges et noirs, droits et minéraux.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.2} className="bg-white p-8 border border-stone-200">
                            <h3 className="text-2xl font-serif text-wine-900 mb-4">Le Chardonnay</h3>
                            <p className="text-gray-800 leading-relaxed text-sm">
                                Sur quelques parcelles argilo-calcaires choisies, il donne un Bourgogne blanc floral, aux notes d'agrumes et de fleurs blanches.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3} className="bg-white p-8 border border-stone-200">
                            <h3 className="text-2xl font-serif text-wine-900 mb-4">Notre façon de faire</h3>
                            <p className="text-gray-800 leading-relaxed text-sm">
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
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">Nos vins</h2>
                            <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed mb-8">
                                Des vins précis, vivants, en petites quantités. Ils partent directement de notre cave à Odenas, partout en France.
                            </p>
                        </FadeIn>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* DYNAMIC PRODUCTS */}
                        {products.slice(0, 3).map((wine, index) => (
                            <FadeIn key={wine.id} delay={0.1 + index * 0.2} className="group flex flex-col h-full">
                                <Link href={cuveeHref(wine)} className="flex-grow">
                                    <div className="relative h-[320px] sm:h-[380px] md:h-[500px] overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4 md:p-8 border border-transparent hover:border-gray-100 transition-colors">
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-10 duration-500"></div>
                                        <Image
                                            src={wine.image || "/images/bouteilles/brouilly.jpg"}
                                            alt={`${wine.name} - Domaine de Garanches`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            loading="lazy"
                                            quality={75}
                                            className="object-contain mix-blend-multiply p-4"
                                        />
                                    </div>
                                    <div className="text-center px-4">
                                        <h3 className="text-2xl md:text-3xl font-serif text-gray-900 group-hover:text-red-900 transition-colors">
                                            {wine.name}
                                        </h3>
                                        <div className="h-[1px] w-10 bg-gray-300 mx-auto my-4 group-hover:bg-red-900 transition-colors"></div>
                                        <p className="text-sm text-gray-700 font-bold mb-2">
                                            {wine.subtitle || "Vin du Domaine"}
                                        </p>
                                        <p className="text-xl font-bold text-red-900 mb-4">
                                            {prixAffiche(wine)}
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
                            className="inline-block px-8 py-3 md:px-12 md:py-4 border border-gray-900 text-gray-900 text-base font-medium hover:bg-gray-900 hover:text-white transition-all duration-300"
                        >
                            Voir toutes les cuvées
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
