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
        <section className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
                {TEAM.map((person, i) => (
                    <FadeIn key={person.name} delay={(i % 3) * 0.1} className="text-center group">
                        <div className="h-96 w-full relative mb-6 overflow-hidden rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700">
                            <Image
                                src={person.image}
                                alt={person.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <h3 className="text-2xl font-serif text-wine-900">{person.name}</h3>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}
