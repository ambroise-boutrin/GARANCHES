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
            // Montserrat en 700 écrase le Cormorant : le « gras » du site est un semi-gras.
            fontWeight: {
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