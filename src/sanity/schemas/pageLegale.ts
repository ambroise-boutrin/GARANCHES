export const PAGES_LEGALES = [
    { title: 'Mentions légales', value: 'mentions-legales' },
    { title: 'Conditions générales de vente', value: 'cgv' },
    { title: 'Politique de confidentialité', value: 'politique-confidentialite' },
];

// Mentions légales, CGV, confidentialité : tout le texte de la page.
export default {
    name: 'pageLegale',
    title: 'Page légale',
    type: 'document',
    fields: [
        { name: 'page', title: 'Page', type: 'string', options: { list: PAGES_LEGALES }, readOnly: true },
        { name: 'titre', title: 'Titre', type: 'string', validation: (Rule: any) => Rule.required() },
        {
            name: 'contenu',
            title: 'Texte',
            description: 'Choisissez « Intertitre » dans le menu des styles pour un sous-titre.',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Paragraphe', value: 'normal' },
                        { title: 'Intertitre', value: 'h3' },
                    ],
                    lists: [{ title: 'Liste à puces', value: 'bullet' }],
                    marks: {
                        decorators: [{ title: 'Gras', value: 'strong' }],
                        annotations: [
                            { name: 'link', type: 'object', title: 'Lien', fields: [{ name: 'href', type: 'string', title: 'Adresse' }] },
                        ],
                    },
                },
            ],
        },
    ],
    preview: {
        select: { page: 'page', titre: 'titre' },
        prepare: ({ page, titre }: any) => ({ title: titre || PAGES_LEGALES.find((p) => p.value === page)?.title || page }),
    },
};
