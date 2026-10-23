import Image from "next/image";
import FadeIn from "@/components/FadeIn";

// Repris de l'ancienne page « Notre histoire ».
const TEAM = [
    { name: "Michel Stagnara", image: "/images/1_image.jpg" },
    { name: "Isabelle Stagnara", image: "/images/22_image.jpg" },
    { name: "Ambroise Stagnara", image: "/images/26_image.jpg" },
    { name: "Aurélie Crozet", image: "/images/3_image.jpg" },
    { name: "Laeticia Stagnara", image: "/images/4_image.jpg" },
    { name: "Tancrède Stagnara", image: "/images/15_image.jpg" },
    { name: "Romain Martinache", image: "/images/18_image.jpg" },
];

export default function Team() {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-10">
                {TEAM.map((person, i) => (
                    <FadeIn key={person.name} delay={(i % 3) * 0.1} className="text-center group">
                        <div className="aspect-[4/5] md:aspect-auto md:h-96 w-full relative mb-3 md:mb-6 overflow-hidden rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700">
                            <Image
                                src={person.image}
                                alt={person.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <h3 className="normal-case tracking-normal text-lg md:text-2xl font-serif text-wine-900 leading-tight">{person.name}</h3>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
