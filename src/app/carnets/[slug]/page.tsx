import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { getCarnet } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { formatDate, themeLabel } from "@/lib/carnets";
import PageCards from "@/components/editorial/PageCards";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const carnet = await getCarnet(params.slug);
    if (!carnet) return {};
    return {
        title: carnet.titre,
        description: carnet.extrait,
        alternates: { canonical: `/carnets/${params.slug}` },
    };
}

const components: PortableTextComponents = {
    types: {
        image: ({ value }) =>
            value?.asset ? (
                <figure className="my-10">
                    <Image
                        src={urlFor(value).width(1400).url()}
                        alt={value.legende || ""}
                        width={1400}
                        height={900}
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="w-full h-auto rounded-lg"
                    />
                    {value.legende && <figcaption className="text-sm text-gray-500 italic mt-2 text-center">{value.legende}</figcaption>}
                </figure>
            ) : null,
    },
};

export default async function CarnetPage({ params }: Props) {
    const carnet = await getCarnet(params.slug);
    if (!carnet) notFound();

    return (
        <main className="min-h-screen bg-paper pt-32">
            <article className="max-w-3xl mx-auto px-6">
                <Link href="/carnets" className="text-amber-700 font-serif italic text-xl hover:text-wine-900 transition-colors">
                    Les Carnets de Garanches
                </Link>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-8 mb-3">
                    {[themeLabel(carnet.theme), formatDate(carnet.date)].filter(Boolean).join(" · ")}
                </p>
                <h1 className="text-4xl md:text-5xl font-serif text-wine-900 mb-10 leading-tight">{carnet.titre}</h1>
                {carnet.image?.asset && (
                    <div className="relative h-[420px] rounded-lg overflow-hidden mb-12">
                        <Image src={urlFor(carnet.image).width(1600).url()} alt="" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                    </div>
                )}
                <div className="text-gray-700 font-light leading-relaxed text-lg space-y-5">
                    {carnet.contenu && <PortableText value={carnet.contenu} components={components} />}
                </div>
            </article>

            {/* Un Carnet renvoie vers les autres univers. */}
            <div className="bg-stone-100 mt-20">
                <PageCards paths={["le-lieu", "les-vins", "rencontrons-garanches"]} title="Poursuivre" />
            </div>
        </main>
    );
}
