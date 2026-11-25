import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/Lien";
import FadeIn from "@/components/FadeIn";
import RichText from "@/components/editorial/RichText";
import SousNav from "@/components/editorial/SousNav";
import { PageHero } from "@/components/editorial/EditorialPage";
import { carnetsCarteDe, carnetThemesDe, pagesDe } from "@/data/architecture";
import { formatDate, themeLabel } from "@/lib/carnets";
import { getCarnets } from "@/sanity/lib/queries";
import { getContenuSite } from "@/sanity/lib/contenu";
import { texteDe } from "@/lib/contenu";
import { urlFor } from "@/sanity/lib/image";
import { partage } from "@/lib/site";
import { alternatives } from "@/lib/langue";
import { definirLangue } from "@/lib/langueServeur";
import { UI } from "@/i18n/ui";
import { ALTS_EN } from "@/i18n/en/divers";

type Props = { params: { lang: string }; searchParams: { theme?: string } };

export async function generateMetadata({ params }: Omit<Props, "searchParams">): Promise<Metadata> {
    const langue = definirLangue(params.lang);
    const CARNETS_CARD = carnetsCarteDe(langue);
    // Tant qu'aucun carnet n'est publié, la page est presque vide : Google ne la montre pas encore.
    const carnets = await getCarnets();
    return {
        title: CARNETS_CARD.label,
        ...(carnets.length === 0 && { robots: { index: false, follow: true } }),
        description: CARNETS_CARD.description,
        alternates: alternatives("/carnets", langue),
        ...partage({ chemin: "/carnets", titre: `${CARNETS_CARD.label} | Domaine de Garanches`, description: CARNETS_CARD.description, image: CARNETS_CARD.image, alt: langue === "en" ? ALTS_EN[CARNETS_CARD.image] : "Le portail du domaine, marqué Garanches" }),
    };
}

export default async function CarnetsPage({ params, searchParams }: Props) {
    const langue = definirLangue(params.lang);
    const ui = UI[langue];
    const CARNETS_CARD = carnetsCarteDe(langue);
    const [carnets, contenu] = await Promise.all([getCarnets(), getContenuSite()]);
    const infos = contenu.pages.carnets;
    const theme = searchParams.theme;
    const visible = theme ? carnets.filter((c: any) => c.theme === theme) : carnets;

    return (
        <main className="min-h-screen bg-paper pb-20">
            {/* Même ouverture et même barre que les autres pages du Lieu. */}
            <PageHero image={CARNETS_CARD.image} label={infos?.titre ?? CARNETS_CARD.label} parent={{ path: "le-lieu", label: contenu.pages["le-lieu"]?.titre ?? pagesDe(langue)["le-lieu"].label }} photo={infos?.photo} />
            <SousNav path="le-lieu" current="/carnets" />

            <FadeIn direction="down" className="text-center px-6 pt-10 md:pt-24 mb-16">
                <h2 className="text-2xl md:text-3xl font-serif text-wine-900 mb-6">{texteDe(contenu, "carnets.intro.titre")}</h2>
                <RichText text={texteDe(contenu, "carnets.intro.texte")} className="max-w-2xl mx-auto text-gray-700 leading-relaxed text-lg" />
            </FadeIn>

            {ui.carnetsEnFrancais && carnets.length > 0 && (
                <p lang={langue} className="text-center text-sm text-gray-700 px-6 -mt-8 mb-10">{ui.carnetsEnFrancais}</p>
            )}

            <nav aria-label={ui.themes} className="flex flex-wrap justify-center gap-3 px-6 mb-16">
                {[{ title: ui.tous, value: "" }, ...carnetThemesDe(langue)].map((t) => (
                    <Link
                        key={t.value}
                        href={t.value ? `/carnets?theme=${t.value}` : "/carnets"}
                        className={`px-4 py-2 text-sm border transition-colors ${
                            (theme || "") === t.value ? "bg-wine-900 text-white border-wine-900" : "border-stone-300 text-gray-800 hover:border-wine-900"
                        }`}
                    >
                        {t.title}
                    </Link>
                ))}
            </nav>

            <div className="max-w-7xl mx-auto px-6">
                {visible.length === 0 ? (
                    <p className="text-center text-gray-600">{ui.carnetsBientot}</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-10">
                        {visible.map((c: any, i: number) => (
                            <FadeIn key={c.slug} delay={(i % 3) * 0.1}>
                                <Link href={`/carnets/${c.slug}`} className="group block">
                                    <div className="relative h-64 overflow-hidden bg-stone-100 mb-5">
                                        <Image
                                            src={c.image?.asset ? urlFor(c.image).width(900).url() : CARNETS_CARD.image}
                                            alt={c.titre || ""}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="text-sm text-red-900 font-bold mb-2">
                                        {[themeLabel(c.theme, langue), formatDate(c.date, langue)].filter(Boolean).join(" · ")}
                                    </p>
                                    <h3 lang="fr" className="text-2xl font-serif text-wine-900 mb-3 group-hover:text-red-900 transition-colors">{c.titre}</h3>
                                    {c.extrait && <p lang="fr" className="text-sm text-gray-800 leading-relaxed">{c.extrait}</p>}
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
