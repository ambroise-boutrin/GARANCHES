import { BANDEAU_PAGES } from '../../data/architecture';

// Grande photo en haut d'une page. Sans document ici, la page garde la photo prévue dans le code.
export default {
    name: 'bandeau',
    title: 'Photo du haut de page',
    type: 'document',
    fields: [
        {
            name: 'page',
            title: 'Page',
            type: 'string',
            options: { list: BANDEAU_PAGES.map(({ title, value }) => ({ title, value })) },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Photo',
            description: 'Au moins 1800 pixels de large, en paysage. Placez le rond sur le sujet pour qu’il reste visible sur téléphone.',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule: any) => Rule.required(),
        },
    ],
    preview: {
        select: { page: 'page', media: 'image' },
        prepare({ page, media }: any) {
            return { title: BANDEAU_PAGES.find((p) => p.value === page)?.title || page, media };
        },
    },
};
