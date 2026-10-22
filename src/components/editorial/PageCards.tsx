import Image from "next/image";
import { cadrage } from "@/data/cadrages";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { card } from "@/data/architecture";

export default function PageCards({ paths, title }: { paths: string[]; title?: string }) {
    const cards = paths.map(card);

    return (
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            {title && (
                <FadeIn className="text-center mb-12">
                    <span className="text-amber-700 font-serif italic text-xl mb-2 block">Garanches</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-wine-900 mb-6">{title}</h2>
                    <div className="w-24 h-1 bg-wine-900 mx-auto opacity-20"></div>
                </FadeIn>
            )}
            <div className={`grid gap-8 ${cards.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                {cards.map((c, i) => (
                    <FadeIn key={c.path} delay={(i % 3) * 0.1}>
                        <Link href={`/${c.path}`} className="group block h-full bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <div className="relative h-56 overflow-hidden bg-stone-100">
                                <Image
                                    src={c.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectPosition: cadrage(c.image) }}
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-serif text-wine-900 mb-2">{c.label}</h3>
                                <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">{c.description}</p>
                                <span className="text-xs uppercase tracking-widest font-bold text-red-900 group-hover:text-amber-600 transition-colors">
                                    {c.cta} →
                                </span>
                            </div>
                        </Link>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
