import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata } from "next";
import Image from "next/image";
import { flou } from "@/data/flous";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { stegaClean } from "@sanity/client/stega";
import FadeIn from "@/components/FadeIn";
import RequestBottlesButton from "@/components/RequestBottlesButton";
import RichText from "@/components/editorial/RichText";
import PageCards from "@/components/editorial/PageCards";
import { getGamme, type Gamme } from "@/lib/wines";
import { nomMillesime } from "@/lib/wineSlug";
import { getContenuSite } from "@/sanity/lib/contenu";
import { photoDe, texteDe } from "@/lib/contenu";
import { SITE_NAME, WINERY_ID, absolu, filAriane, partage } from "@/lib/site";

export const revalidate = 60;

// Une page par vin, sous Les Vins › Les cuvées : une bouteille, puis chaque millésime décliné.
type Props = { params: { porte: string; page: string; cuvee: string } };

async function load({ porte, page, cuvee }: Props["params"]) {
    if (porte !== "les-vins" || page !== "cuvees") return null;
    return getGamme(cuvee);
}

const gammeHref = (g: Gamme) => `/les-vins/cuvees/${g.slug}`;
const annees = (g: Gamme) => g.millesimes.map((w) => w.millesime).filter(Boolean).join(", ");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const gamme = (await load(params))?.gamme;
    if (!gamme) return {};
    const title = titreGoogle(gamme);
    const premier = String(gamme.millesimes[0]?.description || "").split(/\n\s*\n/)[0];
    const description = resume(`${gamme.name} du domaine de Garanches, à Odenas au pied du Mont Brouilly${annees(gamme) ? `, millésimes ${annees(gamme)}` : ""}. ${premier}`);
    return {
        title,
        description,
        alternates: { canonical: gammeHref(gamme) },
        ...partage({
            chemin: gammeHref(gamme),
            titre: `${gamme.name} | ${SITE_NAME}`,
            description,
            image: image(gamme),
            alt: `Bouteille de ${gamme.name}, domaine de Garanches`,
        }),
    };
}

// Titre pour Google : le nom, puis seulement les mots du sous-titre qui n'y sont pas déjà
// (« Beaujolais-Villages blanc » plutôt que « … – Beaujolais-Villages — Blanc »).
function titreGoogle(gamme: Gamme): string {
    const nom = gamme.name;
    const reste = String(gamme.subtitle || "")
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

function Caracteristiques({ items }: { items: { label: string; value?: string }[] }) {
    const remplis = items.filter((d) => d.value);
    if (!remplis.length) return null;
    return (
        <dl className="grid grid-cols-2 gap-4">
            {remplis.map((d) => (
                <div key={d.label} className="bg-white border border-stone-200 p-4">
                    <dt className="text-red-900 text-sm font-bold mb-1">{d.label}</dt>
                    <dd className="text-gray-700 text-sm">{d.value}</dd>
                </div>
            ))}
        </dl>
    );
}

export default async function CuveePage({ params }: Props) {
    const data = await load(params);
    if (data?.redirection) permanentRedirect(data.redirection);
    if (!data?.gamme) notFound();
    const { gamme, gammes } = data;
    const contenu = await getContenuSite();
    const photoHaut = photoDe(contenu, "cuvees.fiche.photo");
    const pageCuvees = contenu.pages["les-vins/cuvees"]?.titre ?? "Les cuvées";
    const autres = gammes.filter((g) => g.slug !== gamme.slug);
    const tags: string[] = gamme.millesimes.find((w) => w.tags?.length)?.tags ?? [];
    const volume = gamme.millesimes.find((w) => w.volume)?.volume;
    const plusieurs = gamme.millesimes.length > 1;

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
                        image: image(gamme),
                        url: absolu(`${gammeHref(gamme)}${w.millesime ? `#${w.millesime}` : ""}`),
                        brand: { "@type": "Brand", name: SITE_NAME },
                        manufacturer: { "@id": WINERY_ID },
                        category: "Vin",
                        countryOfOrigin: "FR",
                    }))),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serialiserJsonLd(filAriane([
                        { nom: "Les Vins", chemin: "/les-vins" },
                        { nom: "Les cuvées", chemin: "/les-vins/cuvees" },
                        { nom: gamme.name, chemin: gammeHref(gamme) },
                    ])),
                }}
            />
            <section className="relative h-[60vh] min-h-[420px] flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0" data-sanity={photoHaut.cliquer}>
                    <Image src={photoHaut.src} alt="Vendanges à la main dans les vignes du Beaujolais" fill sizes="100vw" priority quality={75} {...flou(photoHaut.src, photoHaut.blur)} style={{ objectPosition: photoHaut.position }} className="object-cover brightness-[.6]" />
                </div>
                <FadeIn direction="down" className="relative text-center px-4 pt-20 flex flex-col items-center">
                    <Link href="/les-vins/cuvees" className="text-sm md:text-base text-white underline underline-offset-4 decoration-1">
                        {pageCuvees}
                    </Link>
                    <h1 className="normal-case tracking-normal font-serif text-4xl sm:text-5xl md:text-7xl leading-tight text-white mt-4 mb-4">{gamme.name}</h1>
                    {gamme.subtitle && <p className="text-white/80 text-sm mb-6">{gamme.subtitle}</p>}
                    <div className="w-16 h-0.5 md:w-24 md:h-1 bg-white"></div>
                </FadeIn>
            </section>

            {/* Une seule bouteille pour le vin, puis ce qui est commun à tous ses millésimes */}
            <section className="py-16 md:py-24 bg-stone-50">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-20 items-center">
                    <div className="relative h-[380px] md:h-[460px] bg-white" data-sanity={gamme.cliquerImage}>
                        <Image
                            src={gamme.image || "/images/bouteilles/brouilly.jpg"}
                            alt={`Bouteille de ${gamme.name} - Domaine de Garanches`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-8 mix-blend-multiply"
                        />
                    </div>
                    <div>
                        {plusieurs && (
                            <>
                                <p className="text-red-900 text-sm font-bold mb-3">Millésimes</p>
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {gamme.millesimes.map((w) => (
                                        <a key={w.id} href={`#${w.millesime}`} className="px-5 py-2 border border-wine-900 text-wine-900 text-base hover:bg-wine-900 hover:text-white transition-colors">
                                            {w.millesime}
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                        <Caracteristiques
                            items={[
                                // Le cépage a sa propre case, la ligne « À table » ne garde que les plats.
                                { label: "Cépage", value: tags.filter(estCepage).join(", ") },
                                { label: "À table", value: tags.filter((t) => !estCepage(t)).join(" • ") },
                                { label: "Volume", value: volume },
                                ...(!plusieurs ? [{ label: "Millésime", value: gamme.millesimes[0]?.millesime }] : []),
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Chaque millésime : sa description et ses caractéristiques */}
            {gamme.millesimes.map((w, i) => (
                <section key={w.id} id={w.millesime || w.id} className={`scroll-mt-24 py-16 md:py-24 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="normal-case tracking-normal text-3xl md:text-5xl font-serif text-red-900 mb-6 md:mb-8 leading-tight">{nomMillesime(w)}</h2>
                        {w.description && <RichText text={w.description} className="text-gray-800 leading-relaxed text-base md:text-lg" />}
                        {w.alcohol && (
                            <div className="mt-8">
                                <Caracteristiques items={[{ label: "Alcool", value: w.alcohol }]} />
                            </div>
                        )}
                        {w.parcelle && (
                            <div className="mt-10">
                                <h3 className="text-2xl md:text-3xl font-serif text-wine-900 mb-4">{texteDe(contenu, "cuvees.fiche.parcelle")}</h3>
                                <RichText text={w.parcelle} className="text-gray-800 leading-relaxed text-base md:text-lg" />
                            </div>
                        )}
                        {w.vinification && (
                            <div className="mt-10">
                                <h3 className="text-2xl md:text-3xl font-serif text-wine-900 mb-4">{texteDe(contenu, "cuvees.fiche.vinification")}</h3>
                                <RichText text={w.vinification} className="text-gray-800 leading-relaxed text-base md:text-lg" />
                            </div>
                        )}
                        <RequestBottlesButton wine={w} />
                    </div>
                </section>
            ))}

            {autres.length > 0 && (
                <section className="py-20 bg-stone-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl font-serif text-wine-900 text-center mb-12">{texteDe(contenu, "cuvees.fiche.autres")}</h2>
                        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
                            {autres.map((g) => (
                                <Link key={g.slug} href={gammeHref(g)} className="group sm:w-44 text-center">
                                    <div className="relative h-44 sm:h-48 bg-white mb-3">
                                        <Image src={g.image || "/images/bouteilles/brouilly.jpg"} alt={`Bouteille de ${g.name}`} fill sizes="176px" className="object-contain p-3" />
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
