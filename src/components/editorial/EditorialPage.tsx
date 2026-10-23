import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import FadeIn from "@/components/FadeIn";
import ParallaxImage from "@/components/ParallaxImage";
import RichText from "./RichText";
import PageCards from "./PageCards";
import SousNav from "./SousNav";
import { PAGES, type Bloc, type Page } from "@/data/architecture";
import type { BlocOverride } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { cadrage } from "@/data/cadrages";
import { typo } from "@/lib/typo";

export function bookingHref(sujet: string) {
    return `/contact?sujet=${encodeURIComponent(sujet)}#formulaire`;
}

function BlocSection({ bloc, override, index }: { bloc: Bloc; override?: BlocOverride; index: number }) {
    const title = typo(override?.titre || bloc.title || "");
    const body = override?.texte || bloc.body;
    const image = override?.image?.asset ? urlFor(override.image).width(1400).url() : bloc.image;
    const action = bloc.booking
        ? { label: override?.bouton || bloc.booking.label, href: bookingHref(bloc.booking.sujet) }
        : bloc.cta && { label: override?.bouton || bloc.cta.label, href: bloc.cta.href };
    const pratique = override?.pratique?.length ? override.pratique : bloc.pratique;
    const imageFirst = index % 2 === 1;
    // Mêmes fonds alternés que l'accueil.
    const background = ["bg-stone-50", "bg-white", "bg-stone-100"][index % 3];

    const text = (
        <div>
            {title && <h2 className="text-4xl md:text-5xl font-serif text-red-900 mb-6 md:mb-8 leading-tight">{title}</h2>}
            {body ? (
                <RichText text={body} className="text-gray-600 leading-relaxed md:leading-loose text-base md:text-lg font-light" />
            ) : (
                <p className="text-gray-400 italic font-light">Texte à venir.</p>
            )}
            {pratique && (
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-left">
                    {pratique.map((item) => (
                        <div key={item.label} className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
                            <dt className="text-amber-700 uppercase tracking-widest text-[10px] font-bold mb-1">{item.label}</dt>
                            <dd className="text-gray-700 text-sm">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {action && (bloc.booking ? (
                <Link
                    href={action.href}
                    className="inline-block mt-10 px-10 py-3 bg-red-900/90 hover:bg-red-800 text-white uppercase tracking-widest text-xs font-bold transition-all border border-red-900 duration-300 shadow-lg"
                >
                    {action.label}
                </Link>
            ) : (
                <Link href={action.href} className="group inline-flex items-center mt-10 text-red-900 uppercase text-xs font-bold tracking-widest hover:text-amber-600 transition-colors">
                    <span className="border-b border-red-900 pb-1 group-hover:border-amber-600">{action.label}</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            ))}
        </div>
    );

    return (
        <section id={bloc.id} className={`scroll-mt-24 py-20 md:py-32 overflow-hidden ${background}`}>
            {image ? (
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <FadeIn direction={imageFirst ? "left" : "right"} className={imageFirst ? "md:order-2" : ""}>
                        {text}
                    </FadeIn>
                    <FadeIn direction={imageFirst ? "right" : "left"} delay={0.2} className={imageFirst ? "md:order-1" : ""}>
                        {bloc.document ? (
                            // Archives et diplômes : montrés en entier, comme posés sur une table.
                            <div className="relative w-full aspect-[4/3] bg-stone-200/60">
                                <Image
                                    src={image}
                                    alt={bloc.alt || ""}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={80}
                                    className="object-contain mix-blend-multiply p-5 md:p-8"
                                />
                            </div>
                        ) : (
                            // Cadre au format de la photo, pour ne pas couper les visages sur téléphone.
                            <div className={`w-full relative ${bloc.paysage ? "aspect-[4/3] md:aspect-auto md:h-[420px]" : "aspect-[4/5] md:aspect-auto md:h-[560px]"}`}>
                                <ParallaxImage
                                    src={image}
                                    alt={bloc.alt || ""}
                                    position={cadrage(image)}
                                    className="h-full w-full rounded-lg shadow-xl"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        )}
                    </FadeIn>
                </div>
            ) : (
                <FadeIn className="max-w-3xl mx-auto px-6 text-center">{text}</FadeIn>
            )}
        </section>
    );
}

export default function EditorialPage({
    page,
    overrides,
    children,
}: {
    page: Page;
    overrides: Record<string, BlocOverride>;
    children?: ReactNode;
}) {
    const parent = page.path.includes("/") ? PAGES[page.path.split("/")[0]] : undefined;

    return (
        <main className="min-h-screen text-gray-800 font-sans">
            <section className="relative h-[70vh] min-h-[480px] flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src={page.image} alt="" fill sizes="100vw" priority quality={85} style={{ objectPosition: cadrage(page.image) }} className="object-cover brightness-[.6]" />
                </div>
                <FadeIn direction="down" className="relative text-center px-4 pt-20 flex flex-col items-center">
                    {parent ? (
                        <Link href={`/${parent.path}`} className="uppercase tracking-[0.3em] text-[10px] md:text-sm text-amber-400 font-bold hover:text-white transition-colors">
                            {parent.label}
                        </Link>
                    ) : (
                        <span className="uppercase tracking-[0.3em] text-[10px] md:text-sm text-amber-400 font-bold">Domaine de Garanches</span>
                    )}
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-tight text-white mt-4 mb-8">{page.label}</h1>
                    <div className="w-16 h-0.5 md:w-24 md:h-1 bg-amber-500"></div>
                </FadeIn>
            </section>

            <SousNav path={page.path} />

            {page.blocs.map((bloc, i) => (
                <BlocSection key={bloc.id} bloc={bloc} override={overrides[`${page.path}#${bloc.id}`]} index={i} />
            ))}

            {children}

            {page.children && page.children.length > 0 && (
                <div className="bg-stone-100">
                    <PageCards paths={page.children} title={parent ? "Poursuivre" : "Découvrir"} />
                </div>
            )}
        </main>
    );
}
