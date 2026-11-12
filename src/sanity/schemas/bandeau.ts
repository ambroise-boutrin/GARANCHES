import { BANDEAU_PAGES, PAGES_GOOGLE_SEULEMENT } from '../../data/architecture';

const TOUTES = [...BANDEAU_PAGES, ...PAGES_GOOGLE_SEULEMENT];
const sansPhoto = (document: any) => PAGES_GOOGLE_SEULEMENT.some((p) => p.value === document?.page);

// Une page du site : son nom (menus, titre du haut), sa photo du haut, sa carte et ses textes pour Google.
// Un champ laissé vide garde ce qui est prévu dans le code.
export default {
    name: 'bandeau',
    title: 'Page',
    type: 'document',
    groups: [
        { name: 'page', title: 'Page', default: true },
        { name: 'google', title: 'Google' },
    ],
    fields: [
        {
            name: 'page',
            title: 'Page',
            type: 'string',
            group: 'page',
            options: { list: TOUTES.map(({ title, value }) => ({ title, value })) },
            readOnly: ({ document }: any) => Boolean(document?.page) && String(document?._id || '').includes('page-'),
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'titre',
            title: 'Nom de la page',
            description: 'Affiché en grand en haut de la page, dans les menus et sur les cartes.',
            type: 'string',
            group: 'page',
            hidden: ({ document }: any) => sansPhoto(document),
        },
        {
            name: 'image',
            title: 'Photo du haut',
            description: 'Au moins 1800 pixels de large, en paysage. Placez le rond sur le sujet pour qu’il reste visible sur téléphone.',
            type: 'image',
            group: 'page',
            options: { hotspot: true },
            hidden: ({ document }: any) => sansPhoto(document),
        },
        {
            name: 'motsCles',
            title: 'Mots-clés sous le nom dans le menu',
            description: 'Par exemple « Sols • granit • parcelles ».',
            type: 'string',
            group: 'page',
            hidden: ({ document }: any) => sansPhoto(document),
        },
        {
            name: 'description',
            title: 'Texte de la carte',
            description: 'Phrase affichée quand la page est proposée en carte, en bas des autres pages.',
            type: 'text',
            rows: 2,
            group: 'page',
            hidden: ({ document }: any) => sansPhoto(document),
        },
        {
            name: 'bouton',
            title: 'Lien de la carte',
            type: 'string',
            group: 'page',
            hidden: ({ document }: any) => sansPhoto(document),
        },
        {
            name: 'seoTitre',
            title: 'Titre dans Google',
            description: 'Environ 60 caractères. « | Domaine de Garanches » est ajouté tout seul.',
            type: 'string',
            group: 'google',
            validation: (Rule: any) => Rule.max(70).warning('Google coupe les titres trop longs.'),
        },
        {
            name: 'seoDescription',
            title: 'Description dans Google',
            description: 'Environ 155 caractères : ce qui s’affiche sous le titre dans les résultats.',
            type: 'text',
            rows: 3,
            group: 'google',
            validation: (Rule: any) => Rule.max(170).warning('Google coupe les descriptions trop longues.'),
        },
    ],
    preview: {
        select: { page: 'page', titre: 'titre', media: 'image' },
        prepare({ page, titre, media }: any) {
            return { title: TOUTES.find((p) => p.value === page)?.title || page, subtitle: titre, media };
        },
    },
};
