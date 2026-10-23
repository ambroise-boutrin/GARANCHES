/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Nos couleurs personnalisées Luxe
                'wine': {
                    900: '#4A0404', // Rouge très sombre
                    700: '#722F37', // Bordeaux / Merlot
                    100: '#F3E5E5', // Rose pâle
                },
                'gold': {
                    500: '#C5A059', // Doré
                },
                'paper': '#FDFBF7', // Blanc cassé élégant
            },
            // Style sobre de maison de vin : angles presque droits et ombres discrètes,
            // plutôt que des cartes arrondies et flottantes.
            borderRadius: {
                md: '2px',
                lg: '2px',
                xl: '2px',
                '2xl': '2px',
            },
            boxShadow: {
                sm: 'none',
                md: '0 1px 2px rgb(0 0 0 / 0.06)',
                lg: '0 8px 24px -12px rgb(0 0 0 / 0.18)',
                xl: '0 12px 32px -14px rgb(0 0 0 / 0.22)',
                '2xl': '0 16px 40px -16px rgb(0 0 0 / 0.28)',
            },
            // Le sans-serif en 700 écrase le Cormorant : le « gras » du site est un semi-gras.
            fontWeight: {
                // Jost en 300 devient trop fin et peu lisible sur écran Windows.
                light: '400',
                bold: '600',
            },
            fontFamily: {
                serif: ['var(--font-serif)', 'serif'],
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
};

export default config;