/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Anciennes adresses, redirigées vers la nouvelle arborescence pour garder le référencement.
    async redirects() {
        return [
            { source: '/nos-vins', destination: '/les-vins/cuvees', permanent: true },
            { source: '/notre-histoire', destination: '/le-lieu/histoire', permanent: true },
            { source: '/visite', destination: '/rencontrons-garanches/deguster-au-domaine', permanent: true },
            // Pas de boutique en ligne pour l'instant : l'ancien panier renvoie vers les cuvées.
            { source: '/panier', destination: '/les-vins/cuvees', permanent: false },
            // Vins arrêtés : leurs anciennes fiches renvoient vers les cuvées.
            { source: '/les-vins/cuvees/:id(rose|petillant|cote-de-brouilly)', destination: '/les-vins/cuvees', permanent: true },
        ];
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
            }
        ],
    },
};

export default nextConfig;
