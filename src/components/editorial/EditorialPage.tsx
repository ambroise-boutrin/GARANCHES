import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import FadeIn from "@/components/FadeIn";
import RichText from "./RichText";
import PageCards from "./PageCards";
import { PAGES, type Bloc, type Page } from "@/data/architecture";
import type { BlocOverride } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export function bookingHref(sujet: string) {
    return `/contact?sujet=${encodeURIComponent(sujet)}#formulaire`;
}

function BlocSection({ bloc, override, index }: { bloc: Bloc; override?: BlocOverride; index: number }) {
    const title = override?.titre || bloc.title;
    const body = override?.texte || bloc.body;
    const image = override?.image?.asset ? urlFor(override.image).width(1400).url() : bloc.image;
    const action = bloc.booking
        ? { label: override?.bouton || bloc.booking.label, href: bookingHref(bloc.booking.sujet) }
        : bloc.cta && { label: override?.bouton || bloc.cta.label, href: bloc.cta.href };
    const imageFirst = index % 2 === 1;

    const text = (
        <div>
            {title && <h2 className="text-3xl md:text-4xl font-serif text-wine-900 mb-8 leading-tight">{title}</h2>}
            {body ? (
                <RichText text={body} className="text-gray-700 font-light leading-relaxed text-lg" />
            ) : (
                <p className="text-gray-400 italic font-light">Texte à venir.</p>
            )}
            {action && (
                <Link
                    href={action.href}
                    className="inline-block mt-10 px-8 py-3 border border-wine-900 text-wine-900 uppercase tracking-widest text-xs font-bold rounded-full hover:bg-wine-900 hover:text-white transition-colors"
                >
                    {action.label}
                </Link>
            )}
        </div>
    );

    return (
        <section id={bloc.id} className="scroll-mt-28 max-w-6xl mx-auto px-6 py-16 md:py-24">
            {image ? (
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    <FadeIn direction={imageFirst ? "right" : "left"} className={imageFirst ? "md:order-2" : ""}>
                        {text}
                    </FadeIn>
                    <FadeIn direction={imageFirst ? "left" : "right"} className={imageFirst ? "md:order-1" : ""}>
                        <div className="relative h-[420px] md:h-[520px] rounded-lg overflow-hidden shadow-lg bg-stone-100">
                            <Image
                                src={image}
                                alt={bloc.alt || ""}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    </FadeIn>
                </div>
            ) : (
                <FadeIn className="max-w-2xl mx-auto text-center">{text}</FadeIn>
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
        <main className="min-h-screen bg-paper pt-32 pb-12">
            <FadeIn direction="down" className="text-center px-6 mb-4">
                {parent ? (
                    <Link href={`/${parent.path}`} className="text-amber-700 font-serif italic text-xl hover:text-wine-900 transition-colors">
                        {parent.label}
                    </Link>
                ) : (
                    <span className="text-amber-700 font-serif italic text-xl">Garanches</span>
                )}
                <h1 className="text-4xl md:text-6xl font-serif text-wine-900 mt-4 mb-8">{page.label}</h1>
                <div className="w-24 h-px bg-wine-900 mx-auto opacity-30" />
            </FadeIn>

            {page.blocs.map((bloc, i) => (
                <BlocSection key={bloc.id} bloc={bloc} override={overrides[`${page.path}#${bloc.id}`]} index={i} />
            ))}

            {children}

            {page.children && page.children.length > 0 && (
                <div className="border-t border-stone-200 mt-8">
                    <PageCards paths={page.children} title={parent ? "Poursuivre" : undefined} />
                </div>
            )}
        </main>
    );
}
