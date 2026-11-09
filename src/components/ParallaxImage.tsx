import Image from "next/image";

interface Props {
    src: string;
    alt: string;
    className?: string;
    sizes?: string;
    position?: string;
}

// Photo simple, sans effet de parallaxe au défilement.
export default function ParallaxImage({ src, alt, className = "", sizes = "100vw", position }: Props) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                loading="lazy"
                quality={85}
                style={{ objectPosition: position }}
                className="object-cover"
            />
        </div>
    );
}
