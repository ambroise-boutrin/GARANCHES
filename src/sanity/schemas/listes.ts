
// Listes du site qu'on peut allonger ou réordonner : l'équipe, les téléphones, les questions fréquentes.

export const equipe = {
    name: 'equipe',
    title: 'Équipe',
    type: 'document',
    fields: [
        {
            name: 'membres',
            title: 'Ceux qui le font vivre',
            description: 'Dans l’ordre d’affichage. Glissez une personne pour la déplacer.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'membre',
                    fields: [
                        { name: 'nom', title: 'Prénom et nom', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'photo', title: 'Portrait', description: 'Placez le rond sur le visage.', type: 'image', options: { hotspot: true } },
                    ],
                    preview: { select: { title: 'nom', media: 'photo' } },
                },
            ],
        },
    ],
    preview: { prepare: () => ({ title: 'Équipe' }) },
};

export const telephones = {
    name: 'telephones',
    title: 'Téléphones',
    type: 'document',
    fields: [
        {
            name: 'numeros',
            title: 'Numéros du domaine',
            description: 'Affichés sur la page Contact, dans l’ordre de la liste.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'numero',
                    fields: [
                        { name: 'nom', title: 'Prénom', type: 'string', validation: (Rule: any) => Rule.required() },
                        {
                            name: 'numero',
                            title: 'Numéro',
                            description: 'Format 06 12 34 56 78.',
                            type: 'string',
                            validation: (Rule: any) => Rule.required().regex(/^0\d( \d\d){4}$/, { name: 'numéro' }),
                        },
                    ],
                    preview: { select: { title: 'nom', subtitle: 'numero' } },
                },
            ],
        },
    ],
    preview: { prepare: () => ({ title: 'Téléphones' }) },
};

export const faq = {
    name: 'faq',
    title: 'Questions fréquentes',
    type: 'document',
    fields: [
        {
            name: 'questions',
            title: 'Questions fréquentes',
            description: 'Affichées sur la page Contact et lues par Google.',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'question',
                    fields: [
                        { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
                        { name: 'reponse', title: 'Réponse', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
                    ],
                    preview: { select: { title: 'question', subtitle: 'reponse' } },
                },
            ],
        },
    ],
    preview: { prepare: () => ({ title: 'Questions fréquentes' }) },
};
