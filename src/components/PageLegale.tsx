import { PortableText, type PortableTextComponents } from "next-sanity";

// Mentions légales, CGV, confidentialité saisies dans le studio (Pages légales).
const composants: PortableTextComponents = {
    block: {
        h3: ({ children }) => <h3>{children}</h3>,
    },
    marks: {
        link: ({ value, children }) => <a href={value?.href} className="text-wine-900 underline underline-offset-2">{children}</a>,
    },
};

export default function PageLegale({ titre, contenu }: { titre: string; contenu: any[] }) {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-wine-900 mb-8 border-b-2 border-wine-100 pb-4">{titre}</h1>
                <PortableText value={contenu} components={composants} />
            </div>
        </main>
    );
}
