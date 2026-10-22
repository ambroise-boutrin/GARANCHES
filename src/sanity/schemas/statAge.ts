import { TRANCHES_AGE, champTranche } from '../../data/tranchesAge';

// Un document par mois, rempli automatiquement à l'entrée du site (voir /api/tranche-age).
export default {
    name: 'statAge',
    title: "Âge des visiteurs",
    type: 'document',
    readOnly: true,
    fields: [
        { name: 'mois', title: 'Mois', type: 'string' },
        { name: 'total', title: 'Total des entrées', type: 'number' },
        ...TRANCHES_AGE.map((t) => ({
            name: champTranche(t.id),
            title: t.id === '65+' ? '65 ans et plus' : `${t.min} à ${t.max} ans`,
            type: 'number',
        })),
    ],
    orderings: [{ title: 'Mois récent', name: 'moisDesc', by: [{ field: 'mois', direction: 'desc' }] }],
    preview: {
        select: { mois: 'mois', total: 'total' },
        prepare: ({ mois, total }: { mois?: string; total?: number }) => ({
            title: mois ?? '',
            subtitle: `${total ?? 0} entrées`,
        }),
    },
};
