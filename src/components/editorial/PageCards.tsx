import Image from "next/image";
import { cadrage } from "@/data/cadrages";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { card } from "@/data/architecture";
import { getContenuSite } from "@/sanity/lib/contenu";
import { texteDe } from "@/lib/contenu";

// Cartes vers d'autres pages : nom, texte, lien et photo modifiables dans le studio (Pages).
export default async function PageCards({ paths, title: titre }: { paths: string[]; title?: string }) {
    const contenu = await getContenuSite();
    const title = titre ?? texteDe(contenu, "pages.poursuivre");
    const cards = paths.map((path) => {
        const c = card(path);
        const infos = contenu.pages[path];
        return {
            ...c,
            label: infos?.titre ?? c.label,
            description: infos?.description ?? c.description,
            cta: infos?.bouton ?? c.cta,
            image: infos?.photo?.src ?? c.image,
            position: infos?.photo ? infos.photo.position : cadrage(c.image),
        };
    });

    return (
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            {title && (
                <FadeIn className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif text-wine-900 mb-6">{title}</h2>
                </FadeIn>
            )}
            <div className={`grid gap-8 ${cards.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                {cards.map((c, i) => (
                    <FadeIn key={c.path} delay={(i % 3) * 0.1}>
                        <Link href={`/${c.path}`} className="group block h-full bg-white border border-stone-200 overflow-hidden">
                            <div className="relative h-56 overflow-hidden bg-stone-100">
                                <Image
                                    src={c.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectPosition: c.position }}
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-serif text-wine-900 mb-2">{c.label}</h3>
                                <p className="text-sm text-gray-800 leading-relaxed mb-4">{c.description}</p>
                                <span className="text-base text-red-900 underline underline-offset-4 decoration-1 group-hover:text-red-700 transition-colors">
                                    {c.cta}
                                </span>
                            </div>
                        </Link>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
