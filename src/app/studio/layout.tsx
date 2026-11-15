import type { Metadata, Viewport } from "next";

// Le studio Sanity a sa propre page, sans le menu ni le pied de page du site.
export const metadata: Metadata = {
    title: "Studio | Domaine de Garanches",
    robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    );
}
