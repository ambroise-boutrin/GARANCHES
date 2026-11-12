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
import { getContenuSite, type PhotoPrete } from "@/sanity/lib/contenu";
import { texteDe } from "@/lib/contenu";
import { photoSanity } from "@/sanity/lib/photo";
import { cadrage } from "@/data/cadrages";
import { flou } from "@/data/flous";
import { altPhoto } from "@/data/alts";
import { typo } from "@/lib/typo";

// Photo d'ouverture des pages, partagée avec les Carnets.
export function PageHero({ image: imageCode, label, parent, photo }: { image: string; label: string; parent?: { path: string; label: string }; photo?: PhotoPrete }) {
    // Photo changée dans le studio (Pages › Photo du haut), sinon celle prévue dans le code.
    const image = photo?.src ?? imageCode;
    return (
        <section className="relative h-[70vh] min-h-[480px] bg-stone-900 flex flex-col justify-center items-center overflow-hidden">
            <div className="absolute inset-0 z-0" data-sanity={photo?.cliquer}>
                <Image src={image} alt={altPhoto(image, `${label}, domaine de Garanches à Odenas`)} fill sizes="100vw" priority quality={75} {...flou(image, photo?.blur)} style={{ objectPosition: photo ? photo.position : cadrage(image) }} className="object-cover brightness-[.6]" />
            </div>
            <FadeIn direction="down" className="relative text-center px-4 pt-20 flex flex-col items-center">
                {parent && (
                    <Link href={`/${parent.path}`} className="text-sm md:text-base text-white underline underline-offset-4 decoration-1">
                        {parent.label}
                    </Link>
                )}
                <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-tight text-white mt-4 mb-8">{label}</h1>
            </FadeIn>
        </section>
    );
}

export function bookingHref(sujet: string) {
    return `/contact?sujet=${encodeURIComponent(sujet)}#formulaire`;
}

function BlocSection({ bloc, override, index, texteAVenir }: { bloc: Bloc; override?: BlocOverride; index: number; texteAVenir: string }) {
    const title = typo(override?.titre || bloc.title || "");
    const body = override?.texte || bloc.body;
    const sanity = photoSanity(override?.image, 1800);
    const image = sanity?.src ?? bloc.image;
    const position = sanity ? sanity.position : cadrage(image);
    const action = bloc.booking
        ? { label: override?.bouton || bloc.booking.label, href: bookingHref(bloc.booking.sujet) }
        : bloc.cta && { label: override?.bouton || bloc.cta.label, href: bloc.cta.href };
    const pratique = override?.pratique?.length ? override.pratique : bloc.pratique;
    const imageFirst = index % 2 === 1;
    // Mêmes fonds alternés que l'accueil.
    const background = ["bg-stone-50", "bg-white", "bg-stone-100"][index % 3];

    const text = (
        <div>
            {title && <h2 className="text-3xl md:text-5xl font-serif text-red-900 mb-6 md:mb-8 leading-tight">{title}</h2>}
            {body ? (
                <RichText text={body} className="text-gray-800 leading-relaxed text-base md:text-lg" />
            ) : (
                <p className="text-gray-600">{texteAVenir}</p>
            )}
            {pratique && (
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-left">
                    {pratique.map((item) => (
                        <div key={item.label} className="bg-white border border-stone-200 p-4">
                            <dt className="text-red-900 text-sm font-bold mb-1">{item.label}</dt>
                            <dd className="text-gray-700 text-sm">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {action && (bloc.booking ? (
                <Link
                    href={action.href}
                    className="inline-block mt-10 px-10 py-3 bg-red-900/90 hover:bg-red-800 text-white text-base font-medium transition-colors border border-red-900 duration-300"
                >
                    {action.label}
                </Link>
            ) : (
                <Link href={action.href} className="group inline-flex items-center mt-10 text-red-900 text-base hover:text-red-700 transition-colors">
                    <span className="border-b border-red-900 pb-1 group-hover:border-red-700">{action.label}</span>
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
                            <div className="relative w-full aspect-[4/3] bg-stone-200/60" data-sanity={override?.cliquerImage}>
                                <Image
                                    src={image}
                                    alt={bloc.alt || ""}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={75}
                                    className="object-contain mix-blend-multiply p-5 md:p-8"
                                />
                            </div>
                        ) : (
                            // Cadre au format de la photo, pour ne pas couper les visages sur téléphone.
                            <div data-sanity={override?.cliquerImage} className={`w-full relative ${bloc.paysage ? "aspect-[4/3] md:aspect-auto md:h-[420px]" : "aspect-[4/5] md:aspect-auto md:h-[560px]"}`}>
                                <ParallaxImage
                                    src={image}
                                    parallaxe
                                    alt={bloc.alt || ""}
                                    position={position}
                                    blur={sanity?.blur}
                                    className="h-full w-full"
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

export default async function EditorialPage({
    page,
    overrides,
    children,
}: {
    page: Page;
    overrides: Record<string, BlocOverride>;
    children?: ReactNode;
}) {
    const contenu = await getContenuSite();
    const infos = contenu.pages[page.path];
    const parentCode = page.path.includes("/") ? PAGES[page.path.split("/")[0]] : undefined;
    const parent = parentCode && { path: parentCode.path, label: contenu.pages[parentCode.path]?.titre ?? parentCode.label };
    const texteAVenir = texteDe(contenu, "pages.a-venir");

    return (
        <main className="min-h-screen text-gray-800 font-sans">
            <PageHero image={page.image} label={infos?.titre ?? page.label} parent={parent} photo={infos?.photo} />

            <SousNav path={page.path} />

            {page.blocs.map((bloc, i) => (
                <BlocSection key={bloc.id} bloc={bloc} override={overrides[`${page.path}#${bloc.id}`]} index={i} texteAVenir={texteAVenir} />
            ))}

            {children}

            {page.children && page.children.length > 0 && (
                <div className="bg-stone-100">
                    <PageCards paths={page.children} title={texteDe(contenu, parent ? "pages.poursuivre" : "pages.decouvrir")} />
                </div>
            )}
        </main>
    );
}
