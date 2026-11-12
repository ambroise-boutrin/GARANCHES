import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { cadrage } from "@/data/cadrages";
import { flou } from "@/data/flous";
import { getEquipe } from "@/sanity/lib/contenu";
import { TEAM } from "@/data/equipe";

export default async function Team() {
    const equipe = await getEquipe();
    const membres = equipe
        ? equipe.map((m) => ({ nom: m.nom, src: m.photo?.src, position: m.photo?.position, blur: m.photo?.blur, cliquer: m.photo?.cliquer }))
        : TEAM.map((p) => ({ nom: p.name, src: p.image, position: cadrage(p.image), blur: undefined, cliquer: undefined }));

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-10">
                {membres.map((personne, i) => (
                    <FadeIn key={`${personne.nom}-${i}`} delay={(i % 3) * 0.1} className="text-center group">
                        <div className="aspect-[4/5] md:aspect-auto md:h-96 w-full relative mb-3 md:mb-6 overflow-hidden bg-stone-100" data-sanity={personne.cliquer}>
                            {personne.src && (
                                <Image
                                    src={personne.src}
                                    alt={personne.nom}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    {...flou(personne.src, personne.blur)}
                                    style={{ objectPosition: personne.position }}
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <h3 className="text-lg md:text-2xl font-serif text-wine-900 leading-tight">{personne.nom}</h3>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
