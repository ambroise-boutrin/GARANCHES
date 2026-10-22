import { CARNET_THEMES } from '../../data/architecture';

export default {
    name: 'carnet',
    title: 'Carnet',
    type: 'document',
    fields: [
        {
            name: 'titre',
            title: 'Titre',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Adresse de la page',
            type: 'slug',
            options: { source: 'titre' },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'date',
            title: 'Date',
            type: 'date',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'theme',
            title: 'Thème',
            type: 'string',
            options: { list: CARNET_THEMES },
        },
        {
            name: 'image',
            title: 'Image principale',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'extrait',
            title: 'Extrait',
            type: 'text',
            rows: 3,
        },
        {
            name: 'contenu',
            title: 'Contenu',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [{ name: 'legende', title: 'Légende', type: 'string' }],
                },
            ],
        },
    ],
    orderings: [
        { title: 'Date, du plus récent', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    ],
    preview: {
        select: { title: 'titre', subtitle: 'date', media: 'image' },
    },
};
