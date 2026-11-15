import { serialiserJsonLd } from '@/lib/jsonLd';
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import PrechargePhotos from "@/components/PrechargePhotos";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import SmoothScroll from "@/components/SmoothScroll";
import Script from "next/script";
import { Providers } from "./providers";
import CookieConsent from "@/components/CookieConsent";
import ApercuStudio from "@/components/ApercuStudio";
import { ContenuProvider } from "@/components/Contenu";
import { getContenuSite } from "@/sanity/lib/contenu";
import { draftMode } from "next/headers";
import { SITE_URL, SITE_NAME, WINERY_ID, absolu, partage } from "@/lib/site";
import { CODE_LANGUE, LANGUES, estLangue, type Langue } from "@/lib/langue";
import { notFound } from "next/navigation";
import { definirLangue } from "@/lib/langueServeur";
import { SEO_AUTRES_EN } from "@/i18n/en/seo";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: 'swap',
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

// Barres de Safari (haut et bas) et rebond du défilement en sombre, pas en blanc.
export const viewport: Viewport = {
  themeColor: "#1c1917",
};

// Deux versions du site : /… en français, /en/… en anglais (voir src/middleware.ts).
export function generateStaticParams() {
  return LANGUES.map((lang) => ({ lang }));
}

type Props = { children: React.ReactNode; params: { lang: string } };

// --- CONFIGURATION SEO ---
// L'adresse du site vient de src/lib/site.ts (domaine de production Vercel).
export function generateMetadata({ params }: Omit<Props, "children">): Metadata {
  const en = definirLangue(params.lang) === "en";
  return {
  metadataBase: new URL(SITE_URL),
  title: {
    default: en ? SEO_AUTRES_EN.accueil.title : "Domaine de Garanches | Vins de Brouilly et Bourgogne blanc à Odenas",
    template: "%s | Domaine de Garanches"
  },
  description: en ? SEO_AUTRES_EN.accueil.description : "Domaine viticole familial à Odenas, au pied du Mont Brouilly : Brouilly, Beaujolais-Villages blanc et Bourgogne blanc. Dégustation et visite des vignes au domaine.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  ...partage({
    chemin: en ? "/en" : "/",
    titre: en ? SEO_AUTRES_EN.accueil.partageTitre : "Domaine de Garanches, vins du Beaujolais à Odenas",
    description: en ? SEO_AUTRES_EN.accueil.partageDescription : "Une histoire de famille depuis 1788 au pied du Mont Brouilly. Découvrez nos vins et venez nous rendre visite au domaine.",
    alt: en ? SEO_AUTRES_EN.accueil.partageAlt : "Le domaine de Garanches au milieu des vignes, vu du ciel",
    langue: en ? "en" : "fr",
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Code de validation Google Search Console (balise HTML), à renseigner dans Vercel si besoin.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
  };
}

// --- DONNÉES STRUCTURÉES (JSON-LD) ---
// Le domaine (lieu, adresse, horaires) et le site lui-même, présents sur toutes les pages.
const jsonLd = (langue: Langue) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Winery",
      "@id": WINERY_ID,
      "name": SITE_NAME,
      "legalName": "GFA Domaine de Garanches",
      "description": langue === "en"
        ? "Family wine estate in Odenas, at the foot of Mont Brouilly, in the Beaujolais: Brouilly, Beaujolais-Villages blanc and Bourgogne blanc."
        : "Domaine viticole familial à Odenas, au pied du Mont Brouilly, dans le Beaujolais : Brouilly, Beaujolais-Villages blanc et Bourgogne blanc.",
      "url": SITE_URL,
      "logo": absolu("/images/logo-maison.png"),
      "image": [
        absolu("/images/smugmug/partage-domaine.jpg"),
        absolu("/images/garanches/maison-domaine.jpg"),
        absolu("/images/smugmug/cave-foudres.jpg"),
      ],
      "telephone": "+33661735667",
      "email": "contact@domainedegaranches.com",
      "vatID": "FR95400409173",
      "knowsLanguage": ["fr", "en"],
      "foundingDate": "1788",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "345 chemin de Garanches",
        "addressLocality": "Odenas",
        "postalCode": "69460",
        "addressRegion": "Auvergne-Rhône-Alpes",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 46.082958,
        "longitude": 4.661828
      },
      "hasMap": "https://www.google.com/maps/search/?api=1&query=Domaine+de+Garanches+345+chemin+de+Garanches+69460+Odenas",
      "areaServed": "FR",
      "currenciesAccepted": "EUR",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "knowsAbout": ["Brouilly", "Beaujolais-Villages blanc", "Bourgogne blanc", "Gamay", "Chardonnay", "Mont Brouilly", "Beaujolais"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#site`,
      "url": SITE_URL,
      "name": SITE_NAME,
      "inLanguage": LANGUES.map((l) => CODE_LANGUE[l]),
      "publisher": { "@id": WINERY_ID },
    },
  ],
});

export default async function RootLayout({ children, params }: Readonly<Props>) {
  // Seulement /… (français, servi en interne par /fr/…) et /en/… : toute autre langue n'existe pas.
  if (!estLangue(params.lang)) notFound();
  const langue = definirLangue(params.lang);
  const apercu = draftMode().isEnabled;
  // Textes, photos, noms des pages et numéros modifiés dans le studio, partagés avec les menus et le pied de page.
  const contenu = await getContenuSite();
  return (
    <html lang={langue} suppressHydrationWarning className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        {/* Masque la vérification d'âge avant l'affichage si elle a déjà été validée,
            sans lire les cookies côté serveur (les pages restent en cache et s'ouvrent instantanément). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(document.cookie.indexOf("age-confirmed=true")>-1||localStorage.getItem("age-confirmed"))document.documentElement.classList.add("age-ok")}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-white text-stone-900 antialiased overflow-x-clip selection:bg-wine-900 selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialiserJsonLd(jsonLd(langue)) }}
        />




        <ContenuProvider value={contenu}>
        <Providers>
          {/* Dans l'aperçu du studio, pas de vérification d'âge ni de bandeau cookies : la page s'affiche directement. */}
          {apercu ? <ApercuStudio /> : <><AgeGate /><CookieConsent /></>}
          <SmoothScroll />
          <Navbar />
          <PrechargePhotos />
          {children}
          <Footer />
        </Providers>
        </ContenuProvider>


        <Script
          defer
          data-domain="domainedegaranches.com"
          src="https://plausible.io/js/script.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
