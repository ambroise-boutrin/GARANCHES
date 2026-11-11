// Adresse officielle du site (même règle que src/lib/site.ts).
const SITE_URL_PAR_DEFAUT = 'https://garanches.vercel.app';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_PAR_DEFAUT).replace(/\/+$/, '');
const SITE_HOST = new URL(SITE_URL).host;

// Dès que le vrai domaine est branché, l'adresse garanches.vercel.app y renvoie (une seule adresse pour Google).
const versDomaine = SITE_HOST === 'garanches.vercel.app' ? [] : [
    { source: '/:path*', has: [{ type: 'host', value: 'garanches.vercel.app' }], destination: `${SITE_URL}/:path*`, permanent: true },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Anciennes adresses, redirigées vers la nouvelle arborescence pour garder le référencement.
    async redirects() {
        return [
            ...versDomaine,
            // Ancien site (Jimdo) : le blog et la boutique mènent aux pages qui les remplacent.
            { source: '/blog/:path*', destination: '/carnets', permanent: true },
            { source: '/j/shop/:path*', destination: '/les-vins/cuvees', permanent: true },
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
