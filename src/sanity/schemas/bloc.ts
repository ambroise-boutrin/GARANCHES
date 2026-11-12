import { BLOC_KEYS } from '../../data/architecture';

// Remplace le titre, le texte, l'image ou le bouton d'un bloc du site.
// Un champ laissé vide garde le texte prévu dans le code.
export default {
    name: 'bloc',
    title: 'Bloc de texte',
    type: 'document',
    fields: [
        {
            name: 'cle',
            title: 'Emplacement',
            type: 'string',
            options: { list: BLOC_KEYS },
            readOnly: ({ document }: any) => Boolean(document?.cle) && String(document?._id || '').includes('bloc-'),
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'titre',
            title: 'Titre',
            type: 'string',
        },
        {
            name: 'texte',
            title: 'Texte',
            type: 'text',
            rows: 12,
            description: 'Une ligne vide sépare deux paragraphes. Entourez un passage de **deux astérisques** pour le mettre en gras.',
        },
        {
            name: 'image',
            title: 'Photo',
            description: 'Placez le rond sur le sujet pour qu’il reste visible sur téléphone.',
            type: 'image',
            options: { hotspot: true },
        },
        {
            name: 'bouton',
            title: 'Texte du bouton',
            type: 'string',
        },
        {
            name: 'pratique',
            title: 'Informations pratiques',
            description: 'Durée, personnes, tarifs, accès… Remplace toute la liste prévue pour ce bloc.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: 'Intitulé', type: 'string' },
                        { name: 'value', title: 'Valeur', type: 'string' },
                    ],
                    preview: { select: { title: 'label', subtitle: 'value' } },
                },
            ],
        },
    ],
    preview: {
        select: { title: 'cle', subtitle: 'titre', media: 'image' },
        prepare({ title, subtitle, media }: any) {
            const key = BLOC_KEYS.find((k) => k.value === title);
            return { title: key?.title || title, subtitle, media };
        },
    },
};
