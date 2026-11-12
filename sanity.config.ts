import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { defineLocations, presentationTool } from 'sanity/presentation';
import { DownloadIcon } from '@sanity/icons';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/structure';
import ImportTool from './src/sanity/tools/ImportTool';
import { BANDEAU_PAGES } from './src/data/architecture';

const libelle = (path: string) => BANDEAU_PAGES.find((p) => p.value === path)?.title || path;

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
                        resolve: (doc) => (doc?.page ? { locations: [{ title: libelle(doc.page), href: `/${doc.page}` }] } : null),
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
        // Les emplacements de textes sont créés par l'import : pas de « nouveau » bloc ou bandeau en double.
        templates: (modeles) => modeles.filter((m) => m.schemaType !== 'statAge'),
    },
    document: {
        // Pas de duplication ni de suppression accidentelle des statistiques.
        actions: (actions, { schemaType }) => (schemaType === 'statAge' ? [] : actions),
    },
});

