export default {
    name: 'pageContent',
    title: 'Contenu de Page',
    type: 'document',
    fields: [
        {
            name: 'page',
            title: 'Page',
            type: 'string',
            options: {
                list: [
                    { title: 'Accueil', value: 'home' },
                    { title: 'Notre Histoire', value: 'history' },
                    { title: 'Nos Vins', value: 'wines' },
                    { title: 'Visite', value: 'visit' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'section',
            title: 'Section',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'title',
            title: 'Titre',
            type: 'string',
        },
        {
            name: 'content',
            title: 'Contenu',
            type: 'text',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'video',
            title: 'Vidéo',
            type: 'file',
            description: "Accueil, section « hero » : vidéo en fond du haut de la page. MP4 sans son, moins de 20 Mo.",
            options: { accept: 'video/mp4,video/webm' },
        },
    ],
};
