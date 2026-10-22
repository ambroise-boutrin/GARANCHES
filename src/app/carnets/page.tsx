import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import RichText from "@/components/editorial/RichText";
import { CARNETS_CARD, CARNETS_INTRO, CARNET_THEMES } from "@/data/architecture";
import { formatDate, themeLabel } from "@/lib/carnets";
import { getCarnets } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
    title: CARNETS_CARD.label,
    description: CARNETS_CARD.description,
    alternates: { canonical: "/carnets" },
};

export default async function CarnetsPage({ searchParams }: { searchParams: { theme?: string } }) {
    const carnets = await getCarnets();
    const theme = searchParams.theme;
    const visible = theme ? carnets.filter((c: any) => c.theme === theme) : carnets;

    return (
        <main className="min-h-screen bg-paper pt-32 pb-20">
            <FadeIn direction="down" className="text-center px-6 mb-16">
                <span className="text-amber-700 font-serif italic text-xl">Garanches</span>
                <h1 className="text-4xl md:text-6xl font-serif text-wine-900 mt-4 mb-8">{CARNETS_CARD.label}</h1>
                <div className="w-24 h-px bg-wine-900 mx-auto opacity-30 mb-10" />
                <h2 className="text-2xl md:text-3xl font-serif text-wine-900 mb-6">{CARNETS_INTRO.title}</h2>
                <RichText text={CARNETS_INTRO.body} className="max-w-2xl mx-auto text-gray-700 font-light leading-relaxed text-lg" />
            </FadeIn>

            <nav aria-label="Thèmes" className="flex flex-wrap justify-center gap-3 px-6 mb-16">
                {[{ title: "Tous", value: "" }, ...CARNET_THEMES].map((t) => (
                    <Link
                        key={t.value}
                        href={t.value ? `/carnets?theme=${t.value}` : "/carnets"}
                        className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                            (theme || "") === t.value ? "bg-wine-900 text-white border-wine-900" : "border-stone-300 text-gray-600 hover:border-wine-900"
                        }`}
                    >
                        {t.title}
                    </Link>
                ))}
            </nav>

            <div className="max-w-7xl mx-auto px-6">
                {visible.length === 0 ? (
                    <p className="text-center text-gray-400 italic font-light">Les premiers carnets arrivent bientôt.</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-10">
                        {visible.map((c: any, i: number) => (
                            <FadeIn key={c.slug} delay={(i % 3) * 0.1}>
                                <Link href={`/carnets/${c.slug}`} className="group block">
                                    <div className="relative h-64 rounded-lg overflow-hidden bg-stone-100 mb-5">
                                        <Image
                                            src={c.image?.asset ? urlFor(c.image).width(900).url() : CARNETS_CARD.image}
                                            alt=""
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <p className="text-xs uppercase tracking-widest text-amber-700 font-bold mb-2">
                                        {[themeLabel(c.theme), formatDate(c.date)].filter(Boolean).join(" · ")}
                                    </p>
                                    <h3 className="text-2xl font-serif text-wine-900 mb-3 group-hover:text-amber-700 transition-colors">{c.titre}</h3>
                                    {c.extrait && <p className="text-sm text-gray-600 font-light leading-relaxed">{c.extrait}</p>}
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
