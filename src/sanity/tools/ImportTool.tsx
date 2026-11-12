'use client';

import { useState } from 'react';
import { useClient, useSchema } from 'sanity';
import { Box, Button, Card, Container, Heading, Stack, Text } from '@sanity/ui';
import { htmlToBlocks } from '@portabletext/block-tools';
import { PAGES_LEGALES } from '../schemas/pageLegale';
import { apiVersion } from '../env';
import { cle, creerImport } from '../import/importer';

// Recopie dans Sanity tout le contenu actuel du site, pour tout retrouver dans le studio
// et le modifier en cliquant sur la page.
// Ne remplace jamais un contenu déjà présent dans Sanity : on peut relancer l'import sans risque
// (par exemple après l'ajout d'un nouveau texte modifiable dans le code).
export default function ImportTool() {
    const client = useClient({ apiVersion });
    const schema = useSchema();
    const [journal, setJournal] = useState<string[]>([]);
    const [etat, setEtat] = useState<'pret' | 'en-cours' | 'fini' | 'erreur'>('pret');

    const noter = (ligne: string) => setJournal((j) => [...j, ligne]);
    const { importerContenu, existe } = creerImport({
        client,
        noter,
        lirePhoto: async (src) => {
            const reponse = await fetch(src);
            if (!reponse.ok) throw new Error(`Photo introuvable : ${src}`);
            return reponse.blob();
        },
    });

    // Pages légales : texte lu sur la page actuelle du site, converti pour l'éditeur du studio.
    async function importerPagesLegales() {
        const typeContenu = (schema.get('pageLegale') as any)?.fields.find((f: any) => f.name === 'contenu')?.type;
        for (const p of PAGES_LEGALES) {
            if (await existe(`_type == "pageLegale" && page == $page`, { page: p.value })) {
                noter(`Déjà présente : ${p.title}`);
                continue;
            }
            const html = await (await fetch(`/${p.value}`)).text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const zone = doc.querySelector('main .prose');
            if (!zone || !typeContenu) {
                noter(`Texte introuvable : ${p.title}`);
                continue;
            }
            const h1 = zone.querySelector('h1');
            const titre = h1?.textContent?.trim() || p.title;
            h1?.remove();
            // Les sous-titres de la page deviennent des intertitres dans l'éditeur.
            zone.querySelectorAll('h2').forEach((h) => { const h3 = doc.createElement('h3'); h3.innerHTML = h.innerHTML; h.replaceWith(h3); });
            const blocs = htmlToBlocks(zone.innerHTML, typeContenu, {
                parseHtml: (h: string) => new DOMParser().parseFromString(h, 'text/html'),
            }).map((b: any) => ({ ...b, _key: b._key || cle() }));
            await client.createIfNotExists({ _id: `legal-${p.value}`, _type: 'pageLegale', page: p.value, titre, contenu: blocs });
            noter(`Ajoutée : ${p.title}`);
        }
    }

    async function importer() {
        setEtat('en-cours');
        setJournal([]);
        try {
            await importerContenu();
            await importerPagesLegales();
            noter('Terminé. Le site affiche maintenant le contenu de Sanity (mise à jour en moins d’une minute).');
            setEtat('fini');
        } catch (erreur: any) {
            noter(`Erreur : ${erreur?.message || erreur}`);
            setEtat('erreur');
        }
    }

    return (
        <Container width={1} padding={4}>
            <Stack space={4}>
                <Heading as="h1" size={2}>Importer le contenu actuel du site</Heading>
                <Text muted>
                    Recopie dans Sanity les vins, les pages, les textes, les photos, l’équipe, les téléphones, les questions fréquentes et les pages légales,
                    tels qu’ils sont aujourd’hui sur le site. Le site ne change pas d’apparence. Ensuite, tout se modifie dans « Mode visuel » ou « Contenu ».
                </Text>
                <Text muted>Un contenu déjà présent dans Sanity n’est jamais remplacé : vous pouvez relancer l’import sans risque. Comptez une à deux minutes.</Text>
                <Box>
                    <Button
                        text={etat === 'en-cours' ? 'Import en cours…' : 'Importer'}
                        tone="primary"
                        disabled={etat === 'en-cours'}
                        onClick={importer}
                    />
                </Box>
                {journal.length > 0 && (
                    <Card padding={3} radius={2} shadow={1} tone={etat === 'erreur' ? 'critical' : 'default'}>
                        <Stack space={2}>
                            {journal.map((ligne, i) => <Text key={i} size={1}>{ligne}</Text>)}
                        </Stack>
                    </Card>
                )}
            </Stack>
        </Container>
    );
}
