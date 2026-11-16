import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata } from "next";
import Image from "next/image";
import { flou } from "@/data/flous";
import Link from "@/components/Lien";
import { notFound, permanentRedirect } from "next/navigation";
import { stegaClean } from "@sanity/client/stega";
import FadeIn from "@/components/FadeIn";
import ChoixMillesime from "@/components/ChoixMillesime";
import PageCards from "@/components/editorial/PageCards";
import { getGamme, type Gamme } from "@/lib/wines";
import { nomMillesime, separeLieuDit } from "@/lib/wineSlug";
import { getContenuSite } from "@/sanity/lib/contenu";
import { photoDe, texteDe } from "@/lib/contenu";
import { SITE_NAME, WINERY_ID, absolu, filAriane, partage } from "@/lib/site";
import { alternatives, lienLangue } from "@/lib/langue";
import { definirLangue } from "@/lib/langueServeur";
import { UI } from "@/i18n/ui";

export const revalidate = 60;

// Une page par vin, sous Les Vins › Les cuvées : une bouteille, puis chaque millésime décliné.
type Props = { params: { lang: string; porte: string; page: string; cuvee: string } };

async function load({ porte, page, cuvee }: Props["params"]) {
    if (porte !== "les-vins" || page !== "cuvees") return null;
    return getGamme(cuvee);
}

const gammeHref = (g: Gamme) => `/les-vins/cuvees/${g.slug}`;
const annees = (g: Gamme) => g.millesimes.map((w) => w.millesime).filter(Boolean).join(", ");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const langue = definirLangue(params.lang);
    const ui = UI[langue];
    const gamme = (await load(params))?.gamme;
    if (!gamme) return {};
    const title = titreGoogle(gamme);
    const premier = String(gamme.millesimes[0]?.description || "").split(/\n\s*\n/)[0];
    const description = resume(`${ui.gammeResume(gamme.name, annees(gamme))} ${premier}`);
    return {
        title,
        description,
        alternates: alternatives(gammeHref(gamme), langue),
        ...partage({
            chemin: gammeHref(gamme),
            titre: `${gamme.name} | ${SITE_NAME}`,
            description,
            image: image(gamme),
            alt: ui.bouteilleDomaine(gamme.name),
        }),
    };
}

// Titre pour Google : le nom, puis seulement les mots du sous-titre qui n'y sont pas déjà
// (« Beaujolais-Villages blanc » plutôt que « … – Beaujolais-Villages — Blanc »).
function titreGoogle(gamme: Gamme): string {
    const { lieuDit, reste: sousTitre } = separeLieuDit(gamme.subtitle);
    const nom = lieuDit ? `${gamme.name} ${lieuDit}` : gamme.name;
    const reste = String(sousTitre || "")
        .split(/\s+[—–-]\s+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s && !nom.toLowerCase().includes(s.toLowerCase()));
    if (!reste.length) return nom;
    const suite = reste.map((s: string, i: number) => (i === 0 ? s : s.charAt(0).toLowerCase() + s.slice(1))).join(" ");
    return `${nom} – ${suite}`;
}

// Description pour Google : coupée proprement vers 155 caractères.
function resume(texte: string) {
    const propre = texte.replace(/\s+/g, " ").trim();
    if (propre.length <= 155) return propre;
    return propre.slice(0, 154).replace(/\s+\S*$/, "") + "…";
}

function image(g: { image?: string }): string {
    return absolu(g.image || "/images/bouteilles/brouilly.jpg");
}

const CEPAGES = ["gamay", "chardonnay", "pinot noir", "aligoté"];
const estCepage = (tag: string) => CEPAGES.includes(stegaClean(tag).trim().toLowerCase());

export default async function CuveePage({ params }: Props) {
    const langue = definirLangue(params.lang);
    const ui = UI[langue];
    const data = await load(params);
    if (data?.redirection) permanentRedirect(lienLangue(data.redirection, langue));
    if (!data?.gamme) notFound();
    const { gamme, gammes } = data;
    const contenu = await getContenuSite();
    const photoHaut = photoDe(contenu, "cuvees.fiche.photo");
    const pageCuvees = contenu.pages["les-vins/cuvees"]?.titre ?? ui.lesCuvees;
    const autres = gammes.filter((g) => g.slug !== gamme.slug);
    const tags: string[] = gamme.millesimes.find((w) => w.tags?.length)?.tags ?? [];
    const volume = gamme.millesimes.find((w) => w.volume)?.volume;

    const { lieuDit, reste: sousTitre } = separeLieuDit(gamme.subtitle);

    return (
        <main className="min-h-screen text-gray-800 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serialiserJsonLd(gamme.millesimes.map((w) => ({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: nomMillesime(w),
                        description: w.description,
                        disambiguatingDescription: gamme.subtitle || undefined,
                        image: image(gamme),
                        url: absolu(`${lienLangue(gammeHref(gamme), langue)}${w.millesime ? `#${w.millesime}` : ""}`),
                        brand: { "@type": "Brand", name: SITE_NAME },
                        manufacturer: { "@id": WINERY_ID },
                        category: ui.categorieVin,
                        countryOfOrigin: "FR",
                    }))),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serialiserJsonLd(filAriane([
                        { nom: contenu.pages["les-vins"]?.titre ? stegaClean(contenu.pages["les-vins"].titre!) : ui.lesVins, chemin: "/les-vins" },
                        { nom: stegaClean(pageCuvees), chemin: "/les-vins/cuvees" },
                        { nom: gamme.name, chemin: gammeHref(gamme) },
                    ])),
                }}
            />
            <section className="relative h-[38svh] min-h-[280px] md:h-[60vh] md:min-h-[420px] bg-stone-900 flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0" data-sanity={photoHaut.cliquer}>
                    <Image src={photoHaut.src} alt={ui.altVendanges} fill sizes="100vw" priority quality={75} {...flou(photoHaut.src, photoHaut.blur)} style={{ objectPosition: photoHaut.position }} className="object-cover brightness-[.6]" />
                </div>
                <FadeIn direction="down" className="relative text-center px-4 pt-16 md:pt-20 flex flex-col items-center">
                    <Link href="/les-vins/cuvees" className="text-sm md:text-base text-white underline underline-offset-4 decoration-1">
                        {pageCuvees}
                    </Link>
                    <h1 className="normal-case tracking-normal font-serif text-4xl sm:text-5xl md:text-7xl leading-tight text-white mt-3 md:mt-4 mb-2 md:mb-4">{gamme.name}</h1>
                    {lieuDit && <p className="font-serif text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-2 md:mb-4">{lieuDit}</p>}
                    {sousTitre && <p className="text-white/80 text-sm md:mb-6">{sousTitre}</p>}
                </FadeIn>
            </section>

            <ChoixMillesime
                millesimes={gamme.millesimes}
                image={gamme.image || "/images/bouteilles/brouilly.jpg"}
                cliquerImage={gamme.cliquerImage}
                nom={gamme.name}
                communs={[
                    // Seul le cépage est affiché : les accords mets-vins de l'ancien site ne sont pas repris.
                    { label: ui.cepage, value: tags.filter(estCepage).join(", ") },
                    { label: ui.volume, value: volume },
                ]}
                titreParcelle={texteDe(contenu, "cuvees.fiche.parcelle")}
                titreVinification={texteDe(contenu, "cuvees.fiche.vinification")}
            />

            {autres.length > 0 && (
                <section className="py-20 bg-stone-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl font-serif text-wine-900 text-center mb-12">{texteDe(contenu, "cuvees.fiche.autres")}</h2>
                        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
                            {autres.map((g) => (
                                <Link key={g.slug} href={gammeHref(g)} className="group sm:w-44 text-center">
                                    <div className="relative h-44 sm:h-48 bg-white mb-3">
                                        <Image src={g.image || "/images/bouteilles/brouilly.jpg"} alt={ui.bouteilleDe(g.name)} fill sizes="176px" className="object-contain p-3" />
                                    </div>
                                    <span className="font-serif text-base sm:text-lg text-wine-900 group-hover:text-red-900 transition-colors">{g.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <PageCards paths={["les-vins/a-table", "acheter"]} />
        </main>
    );
}
