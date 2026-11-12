'use client';

import { useState } from 'react';
import { useClient, useSchema } from 'sanity';
import { Box, Button, Card, Container, Heading, Stack, Text } from '@sanity/ui';
import { htmlToBlocks } from '@portabletext/block-tools';
import { PRODUCTS } from '../../data/products';
import { BANDEAU_PAGES, BLOCS_DU_SITE, PAGES, PAGES_GOOGLE_SEULEMENT, PORTES, CARNETS_CARD } from '../../data/architecture';
import { TEXTES, ZONES } from '../../data/textes';
import { TEAM } from '../../data/equipe';
import { TELEPHONES } from '../../data/contacts';
import { FAQS } from '../../data/faq';
import { cadrage } from '../../data/cadrages';
import { PAGES_LEGALES } from '../schemas/pageLegale';
import { apiVersion } from '../env';

const idDe = (texte: string) => texte.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
const cle = () => Math.random().toString(36).slice(2, 10);

// Point d'intérêt Sanity à partir du cadrage du code (« 50% 20% »).
function pointInteret(src: string) {
    const c = cadrage(src)?.match(/(\d+)%\s+(\d+)%/);
    if (!c) return undefined;
    return { _type: 'sanity.imageHotspot', x: Number(c[1]) / 100, y: Number(c[2]) / 100, width: 1, height: 1 };
}

// Mots-clés affichés sous chaque page dans les menus.
const MOTS_CLES: Record<string, string | undefined> = Object.fromEntries(
    PORTES.flatMap((p) => p.children.map((c) => [c.href.replace(/^\//, ''), c.motsCles]))
);

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
        const point = avecCadrage ? pointInteret(src) : undefined;
        return { _type: 'image', asset: { _type: 'reference', _ref: ref }, ...(point && { hotspot: point }) };
    }

    const existe = (filtre: string, params: Record<string, string> = {}) => client.fetch<number>(`count(*[${filtre}])`, params);

    async function importerVins() {
        for (const [i, vin] of PRODUCTS.entries()) {
            if (await existe(`_type == "wine" && (slug.current == $slug || _id in [$id, "drafts." + $id])`, { slug: vin.id, id: `wine-${vin.id}` })) {
                noter(`Vin déjà présent : ${vin.name}`);
                continue;
            }
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
    }

    async function importerPages() {
        for (const p of BANDEAU_PAGES) {
            if (await existe(`_type == "bandeau" && page == $page`, { page: p.value })) {
                noter(`Page déjà présente : ${p.title}`);
                continue;
            }
            const code = p.value === 'carnets' ? CARNETS_CARD : PAGES[p.value];
            await client.createIfNotExists({
                _id: `page-${idDe(p.value)}`,
                _type: 'bandeau',
                page: p.value,
                titre: code.label,
                ...(MOTS_CLES[p.value] && { motsCles: MOTS_CLES[p.value] }),
                description: code.description,
                bouton: code.cta,
                image: await image(p.image),
            });
            noter(`Page ajoutée : ${p.title}`);
        }
        for (const p of PAGES_GOOGLE_SEULEMENT) {
            if (await existe(`_type == "bandeau" && page == $page`, { page: p.value })) continue;
            await client.createIfNotExists({ _id: `page-${p.value}`, _type: 'bandeau', page: p.value });
            noter(`Page ajoutée : ${p.title}`);
        }
    }

    async function importerBlocs() {
        for (const { page, bloc, cle: emplacement } of BLOCS_DU_SITE) {
            const nom = `${page.label} › ${bloc.title || bloc.id}`;
            if (await existe(`_type == "bloc" && cle == $cle`, { cle: emplacement })) {
                noter(`Déjà présent : ${nom}`);
                continue;
            }
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
    }

    // Une zone par partie du site ; on ajoute seulement les emplacements qui manquent.
    async function importerZones() {
        for (const [zone, titre] of Object.entries(ZONES)) {
            const id = `zone-${zone}`;
            const actuel = await client.fetch<{ entrees?: { cle: string }[] } | null>(`*[_id == $id][0]{ entrees[]{ cle } }`, { id });
            const presentes = new Set((actuel?.entrees ?? []).map((e) => e.cle));
            const manquantes = Object.entries(TEXTES).filter(([k, c]) => c.zone === zone && !presentes.has(k));
            if (!manquantes.length) {
                noter(`Déjà présent : ${titre}`);
                continue;
            }
            const entrees = [];
            for (const [k, c] of manquantes) {
                entrees.push({
                    _key: idDe(k),
                    _type: 'entree',
                    cle: k,
                    libelle: c.libelle,
                    ...(c.photo ? { estPhoto: true, photo: await image(c.defaut) } : { texte: c.defaut }),
                });
            }
            await client.createIfNotExists({ _id: id, _type: 'zone', zone, entrees: [] });
            await client.patch(id).setIfMissing({ entrees: [] }).append('entrees', entrees).commit();
            noter(`${titre} : ${entrees.length} texte(s) et photo(s) ajouté(s)`);
        }
    }

    async function importerListes() {
        if (!(await existe(`_type == "equipe"`))) {
            const membres = [];
            for (const p of TEAM) membres.push({ _key: cle(), _type: 'membre', nom: p.name, photo: await image(p.image) });
            await client.createIfNotExists({ _id: 'equipe', _type: 'equipe', membres });
            noter('Équipe ajoutée');
        } else noter('Équipe déjà présente');

        if (!(await existe(`_type == "telephones"`))) {
            await client.createIfNotExists({
                _id: 'telephones',
                _type: 'telephones',
                numeros: TELEPHONES.map((t) => ({ _key: cle(), _type: 'numero', nom: t.nom, numero: t.numero })),
            });
            noter('Téléphones ajoutés');
        } else noter('Téléphones déjà présents');

        if (!(await existe(`_type == "faq"`))) {
            await client.createIfNotExists({
                _id: 'faq',
                _type: 'faq',
                questions: FAQS.map((f) => ({ _key: cle(), _type: 'question', question: f.question, reponse: f.answer })),
            });
            noter('Questions fréquentes ajoutées');
        } else noter('Questions fréquentes déjà présentes');
    }

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
            await importerVins();
            await importerPages();
            await importerBlocs();
            await importerZones();
            await importerListes();
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
