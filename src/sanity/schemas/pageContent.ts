// Textes de la page d'accueil (les autres pages passent par « Textes et photos des pages »).
export const SECTIONS_ACCUEIL = [
    { title: 'Accueil › Haut de page (phrase et vidéo)', value: 'hero' },
    { title: 'Accueil › Une histoire qui continue', value: 'philosophy' },
];

export default {
    name: 'pageContent',
    title: "Texte de l'accueil",
    type: 'document',
    fields: [
        {
            name: 'page',
            title: 'Page',
            type: 'string',
            hidden: true,
            initialValue: 'home',
        },
        {
            name: 'section',
            title: 'Emplacement',
            type: 'string',
            options: { list: SECTIONS_ACCUEIL },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'title',
            title: 'Titre',
            type: 'string',
            hidden: ({ document }: any) => document?.section === 'hero',
        },
        {
            name: 'content',
            title: 'Texte',
            description: 'Une ligne vide sépare deux paragraphes.',
            type: 'text',
            rows: 6,
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            hidden: true,
        },
        {
            name: 'video',
            title: 'Vidéo',
            description: 'Vidéo en fond du haut de la page. MP4 sans son, moins de 20 Mo.',
            type: 'file',
            options: { accept: 'video/mp4,video/webm' },
            hidden: ({ document }: any) => document?.section !== 'hero',
        },
    ],
    preview: {
        select: { section: 'section', content: 'content' },
        prepare({ section, content }: any) {
            return { title: SECTIONS_ACCUEIL.find((s) => s.value === section)?.title || section, subtitle: content };
        },
    },
};
