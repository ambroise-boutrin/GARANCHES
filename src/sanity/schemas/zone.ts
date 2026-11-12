import { ZONES } from '../../data/textes';

// Petits textes et photos d'une partie du site (accueil, pied de page, contact…).
// Les emplacements sont créés par « Importer le site » ; on modifie seulement le texte ou la photo.
export default {
    name: 'zone',
    title: 'Textes et photos du site',
    type: 'document',
    fields: [
        {
            name: 'zone',
            title: 'Partie du site',
            type: 'string',
            options: { list: Object.entries(ZONES).map(([value, title]) => ({ title, value })) },
            readOnly: true,
        },
        {
            name: 'entrees',
            title: 'Textes et photos',
            type: 'array',
            options: { sortable: false },
            of: [
                {
                    type: 'object',
                    name: 'entree',
                    fields: [
                        { name: 'cle', title: 'Clé', type: 'string', hidden: true },
                        { name: 'estPhoto', title: 'Emplacement de photo', type: 'boolean', hidden: true },
                        { name: 'libelle', title: 'Emplacement', type: 'string', readOnly: true },
                        { name: 'texte', title: 'Texte', type: 'text', rows: 3, hidden: ({ parent }: any) => Boolean(parent?.estPhoto) },
                        { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true }, description: 'Placez le rond sur le sujet pour qu’il reste visible sur téléphone.', hidden: ({ parent }: any) => !parent?.estPhoto },
                    ],
                    preview: {
                        select: { title: 'libelle', subtitle: 'texte', media: 'photo' },
                    },
                },
            ],
        },
    ],
    preview: {
        select: { zone: 'zone' },
        prepare: ({ zone }: any) => ({ title: ZONES[zone] || zone }),
    },
};
