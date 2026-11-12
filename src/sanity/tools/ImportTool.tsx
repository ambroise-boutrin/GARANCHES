'use client';

import { useState } from 'react';
import { useClient } from 'sanity';
import { Box, Button, Card, Container, Heading, Stack, Text } from '@sanity/ui';
import { PRODUCTS } from '../../data/products';
import { BLOCS_DU_SITE } from '../../data/architecture';
import { cadrage } from '../../data/cadrages';
import { apiVersion } from '../env';

// Textes de l'accueil tels qu'ils sont dans le code (src/components/HomePageClient.tsx).
const ACCUEIL: { section: string; title?: string; content: string }[] = [
    {
        section: 'hero',
        content: "À Odenas, au pied du Mont Brouilly, Garanches est un lieu façonné par le temps, le granit et les générations qui l'ont fait vivre.",
    },
    {
        section: 'philosophy',
        title: 'Une histoire qui continue.',
        content: `Garanches porte une histoire qui dépasse largement celle d'une propriété. Des hommes et des femmes y ont travaillé, réfléchi, transmis et parfois dû inventer pour que la vigne puisse continuer.

Ici, le granit se décline du bleu au rose, et les générations de vignes se côtoient : certaines ont près de 150 ans, d'autres n'ont que quelques années. Nous les regardons vivre au fil des saisons, avec ce qu'elles portent du passé et ce qu'elles promettent pour demain.`,
    },
];

const idDe = (texte: string) => texte.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
const cle = () => Math.random().toString(36).slice(2, 10);

// Point d'intérêt Sanity à partir du cadrage du code (« 50% 20% »).
function pointInteret(src: string) {
    const c = cadrage(src)?.match(/(\d+)%\s+(\d+)%/);
    if (!c) return undefined;
    return { _type: 'sanity.imageHotspot', x: Number(c[1]) / 100, y: Number(c[2]) / 100, width: 1, height: 1 };
}

// Recopie dans Sanity le contenu actuel du site (vins, textes et photos des pages, textes de l'accueil),
// pour tout retrouver dans le studio et le modifier en cliquant sur la page.
// Ne touche jamais à un contenu déjà présent dans Sanity : on peut relancer l'import sans risque.
export default function ImportTool() {
    const client = useClient({ apiVersion });
    const [journal, setJournal] = useState<string[]>([]);
    const [etat, setEtat] = useState<'pret' | 'en-cours' | 'fini' | 'erreur'>('pret');

    const noter = (ligne: string) => setJournal((j) => [...j, ligne]);
    const photos = new Map<string, string>();

    async function envoyerPhoto(src: string) {
        if (photos.has(src)) return photos.get(src)!;
        const reponse = await fetch(src);
        if (!reponse.ok) throw new Error(`Photo introuvable : ${src}`);
        const fichier = await reponse.blob();
        const asset = await client.assets.upload('image', fichier, { filename: src.split('/').pop() });
        photos.set(src, asset._id);
        return asset._id;
    }

    async function image(src: string, avecCadrage = true) {
        const ref = await envoyerPhoto(src);
        return {
            _type: 'image',
            asset: { _type: 'reference', _ref: ref },
            ...(avecCadrage && pointInteret(src) && { hotspot: pointInteret(src) }),
        };
    }

    async function importer() {
        setEtat('en-cours');
        setJournal([]);
        try {
            // Vins
            for (const [i, vin] of PRODUCTS.entries()) {
                const existe = await client.fetch(`count(*[_type == "wine" && (slug.current == $slug || _id in [$id, "drafts." + $id])])`, { slug: vin.id, id: `wine-${vin.id}` });
                if (existe) { noter(`Vin déjà présent : ${vin.name}`); continue; }
                await client.createIfNotExists({
                    _id: `wine-${vin.id}`,
                    _type: 'wine',
                    name: vin.name,
                    millesime: vin.millesime,
                    subtitle: vin.subtitle,
                    slug: { _type: 'slug', current: vin.id },
                    ...(typeof vin.price === 'number' && { prix: vin.price / 100 }),
                    enVente: true,
                    afficher: true,
                    ordre: i + 1,
                    description: vin.description,
                    image: await image(vin.image, false),
                    tags: vin.tags,
                    alcohol: vin.alcohol,
                    volume: vin.volume,
                    allergens: vin.allergens,
                });
                noter(`Vin ajouté : ${vin.name} ${vin.millesime ?? ''}`);
            }

            // Textes et photos des pages
            for (const { page, bloc, cle: emplacement } of BLOCS_DU_SITE) {
                const existe = await client.fetch(`count(*[_type == "bloc" && cle == $cle])`, { cle: emplacement });
                const nom = `${page.label} › ${bloc.title || bloc.id}`;
                if (existe) { noter(`Déjà présent : ${nom}`); continue; }
                const bouton = bloc.booking?.label || bloc.cta?.label;
                await client.createIfNotExists({
                    _id: `bloc-${idDe(emplacement)}`,
                    _type: 'bloc',
                    cle: emplacement,
                    ...(bloc.title && { titre: bloc.title }),
                    ...(bloc.body && { texte: bloc.body }),
                    ...(bouton && { bouton }),
                    ...(bloc.pratique && { pratique: bloc.pratique.map((p) => ({ _key: cle(), ...p })) }),
                    ...(bloc.image && { image: await image(bloc.image, !bloc.document) }),
                });
                noter(`Ajouté : ${nom}`);
            }

            // Accueil
            for (const section of ACCUEIL) {
                const existe = await client.fetch(`count(*[_type == "pageContent" && page == "home" && section == $section])`, { section: section.section });
                if (existe) { noter(`Accueil déjà présent : ${section.section}`); continue; }
                await client.createIfNotExists({ _id: `accueil-${section.section}`, _type: 'pageContent', page: 'home', ...section });
                noter(`Accueil ajouté : ${section.section === 'hero' ? 'haut de page' : section.title}`);
            }

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
                    Recopie dans Sanity les vins, les textes et les photos des pages et les textes de l’accueil, tels qu’ils sont aujourd’hui sur le site.
                    Le site ne change pas d’apparence. Ensuite, tout se modifie ici ou dans « Mode visuel ».
                </Text>
                <Text muted>Un contenu déjà présent dans Sanity n’est jamais remplacé : vous pouvez relancer l’import sans risque.</Text>
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
