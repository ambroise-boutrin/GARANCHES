import type { StructureResolver } from 'sanity/structure';
import { BANDEAU_PAGES, BLOCS_DU_SITE, PAGES_GOOGLE_SEULEMENT } from '../data/architecture';
import { ZONES } from '../data/textes';
import { PAGES_LEGALES } from './schemas/pageLegale';
import { apiVersion } from './env';

// Menu du studio, dans l'ordre où on s'en sert : les vins, puis les pages, puis le reste du site.
export const structure: StructureResolver = (S) => {
    const pagesAvecBlocs = BANDEAU_PAGES.filter((p) => BLOCS_DU_SITE.some((b) => b.page.path === p.value));
    const unique = (titre: string, type: string, id: string) =>
        S.listItem().id(id).title(titre).schemaType(type).child(S.document().schemaType(type).documentId(id).title(titre));

    return S.list()
        .title('Contenu')
        .items([
            S.documentTypeListItem('wine').title('Vins'),
            S.divider(),
            S.listItem()
                .id('textes-des-pages')
                .title('Textes et photos des pages')
                .child(
                    S.list()
                        .title('Pages')
                        .items(
                            pagesAvecBlocs.map((p) =>
                                S.listItem()
                                    .id(`blocs-${p.value.replace(/\//g, '-')}`)
                                    .title(p.title)
                                    .child(
                                        S.documentList()
                                            .title(p.title)
                                            .apiVersion(apiVersion)
                                            .schemaType('bloc')
                                            .filter('_type == "bloc" && string::startsWith(cle, $prefixe)')
                                            .params({ prefixe: `${p.value}#` })
                                    )
                            )
                        )
                ),
            S.listItem()
                .id('pages')
                .title('Pages : nom, photo du haut, Google')
                .child(
                    S.list()
                        .title('Pages')
                        .items(
                            [...PAGES_GOOGLE_SEULEMENT, ...BANDEAU_PAGES].map((p) =>
                                unique(p.title, 'bandeau', `page-${p.value.replace(/[^a-zA-Z0-9-]+/g, '-')}`)
                            )
                        )
                ),
            S.listItem()
                .id('zones')
                .title('Accueil, contact, pied de page…')
                .child(
                    S.list()
                        .title('Parties du site')
                        .items(Object.entries(ZONES).map(([zone, titre]) => unique(titre, 'zone', `zone-${zone}`)))
                ),
            S.divider(),
            unique('Équipe', 'equipe', 'equipe'),
            unique('Téléphones', 'telephones', 'telephones'),
            unique('Questions fréquentes', 'faq', 'faq'),
            S.listItem()
                .id('pages-legales')
                .title('Pages légales')
                .child(S.list().title('Pages légales').items(PAGES_LEGALES.map((p) => unique(p.title, 'pageLegale', `legal-${p.value}`)))),
            S.documentTypeListItem('carnet').title('Carnets'),
            S.documentTypeListItem('pageContent').title("Vidéo de l'accueil"),
            S.divider(),
            S.documentTypeListItem('statAge').title('Âge des visiteurs'),
        ]);
};
