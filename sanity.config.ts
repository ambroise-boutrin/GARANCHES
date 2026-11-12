import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { defineLocations, presentationTool } from 'sanity/presentation';
import { DownloadIcon } from '@sanity/icons';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/structure';
import ImportTool from './src/sanity/tools/ImportTool';
import { BANDEAU_PAGES, PAGES_GOOGLE_SEULEMENT } from './src/data/architecture';

const libelle = (path: string) => [...BANDEAU_PAGES, ...PAGES_GOOGLE_SEULEMENT].find((p) => p.value === path)?.title || path;
const adresse = (page: string) => (page === 'accueil' ? '/' : `/${page}`);

// Où apparaît chaque partie du site (zones de petits textes).
const PAGES_DES_ZONES: Record<string, { title: string; href: string }[]> = {
    accueil: [{ title: 'Accueil', href: '/' }],
    cuvees: [{ title: 'Les cuvées', href: '/les-vins/cuvees' }, { title: 'Brouilly', href: '/les-vins/cuvees/brouilly' }],
    contact: [{ title: 'Contact', href: '/contact' }],
    'pied-de-page': [{ title: 'Accueil', href: '/' }],
    carnets: [{ title: 'Les Carnets', href: '/carnets' }],
    pages: [{ title: 'Le domaine', href: '/le-lieu/le-domaine' }],
};

// Types qu'on ne crée pas à la main : ils sont créés une fois par « Importer le site ».
const CREES_PAR_IMPORT = ['statAge', 'bloc', 'bandeau', 'zone', 'equipe', 'telephones', 'faq', 'pageLegale'];

export default defineConfig({
    name: 'default',
    title: 'Domaine de Garanches',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    basePath: '/studio',
    plugins: [
        // « Mode visuel » : le site à côté, on clique sur un texte pour le modifier.
        presentationTool({
            title: 'Mode visuel',
            previewUrl: { initial: '/', previewMode: { enable: '/api/draft-mode/enable' } },
            resolve: {
                // Pour chaque contenu, les pages du site où il apparaît.
                locations: {
                    wine: defineLocations({
                        select: { name: 'name', slug: 'slug.current' },
                        resolve: (doc) => ({
                            locations: [
                                ...(doc?.slug ? [{ title: doc.name || 'Fiche du vin', href: `/les-vins/cuvees/${doc.slug}` }] : []),
                                { title: 'Les cuvées', href: '/les-vins/cuvees' },
                                { title: 'Accueil', href: '/' },
                            ],
                        }),
                    }),
                    bloc: defineLocations({
                        select: { cle: 'cle' },
                        resolve: (doc) => {
                            const path = String(doc?.cle || '').split('#')[0];
                            return path ? { locations: [{ title: libelle(path), href: `/${path}` }] } : null;
                        },
                    }),
                    bandeau: defineLocations({
                        select: { page: 'page' },
                        resolve: (doc) => (doc?.page ? { locations: [{ title: libelle(doc.page), href: adresse(doc.page) }] } : null),
                    }),
                    zone: defineLocations({
                        select: { zone: 'zone' },
                        resolve: (doc) => (doc?.zone ? { locations: PAGES_DES_ZONES[doc.zone] ?? [] } : null),
                    }),
                    equipe: defineLocations({
                        select: {},
                        resolve: () => ({ locations: [{ title: 'Ceux qui le font vivre', href: '/le-lieu/ceux-qui-le-font-vivre' }] }),
                    }),
                    telephones: defineLocations({
                        select: {},
                        resolve: () => ({ locations: [{ title: 'Contact', href: '/contact' }] }),
                    }),
                    faq: defineLocations({
                        select: {},
                        resolve: () => ({ locations: [{ title: 'Contact', href: '/contact' }] }),
                    }),
                    pageLegale: defineLocations({
                        select: { page: 'page', titre: 'titre' },
                        resolve: (doc) => (doc?.page ? { locations: [{ title: doc.titre || doc.page, href: `/${doc.page}` }] } : null),
                    }),
                    pageContent: defineLocations({
                        select: {},
                        resolve: () => ({ locations: [{ title: 'Accueil', href: '/' }] }),
                    }),
                    carnet: defineLocations({
                        select: { titre: 'titre', slug: 'slug.current' },
                        resolve: (doc) => ({
                            locations: [
                                ...(doc?.slug ? [{ title: doc.titre || 'Carnet', href: `/carnets/${doc.slug}` }] : []),
                                { title: 'Les Carnets', href: '/carnets' },
                            ],
                        }),
                    }),
                },
            },
        }),
        structureTool({ title: 'Contenu', structure }),
    ],
    tools: [{ name: 'importer', title: 'Importer le site', icon: DownloadIcon, component: ImportTool }],
    schema: {
        types: schemaTypes,
        templates: (modeles) => modeles.filter((m) => !CREES_PAR_IMPORT.includes(m.schemaType)),
    },
    document: {
        // Statistiques en lecture seule ; pas de suppression ni de copie des emplacements créés par l'import.
        actions: (actions, { schemaType }) => {
            if (schemaType === 'statAge') return [];
            if (CREES_PAR_IMPORT.includes(schemaType)) return actions.filter((a) => !['delete', 'duplicate'].includes(a.action || ''));
            return actions;
        },
    },
});

