import type { StructureResolver } from 'sanity/structure';
import { BANDEAU_PAGES, BLOCS_DU_SITE } from '../data/architecture';
import { apiVersion } from './env';

// Menu du studio, dans l'ordre où on s'en sert : les vins, puis les pages du site.
export const structure: StructureResolver = (S) => {
    const pages = BANDEAU_PAGES.filter((p) => BLOCS_DU_SITE.some((b) => b.page.path === p.value));
    return S.list()
        .title('Contenu')
        .items([
            S.documentTypeListItem('wine').title('Vins'),
            S.listItem()
                .title('Textes et photos des pages')
                .child(
                    S.list()
                        .title('Pages')
                        .items(
                            pages.map((p) =>
                                S.listItem()
                                    .id(p.value.replace(/\//g, '-'))
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
            S.documentTypeListItem('bandeau').title('Photos du haut des pages'),
            S.documentTypeListItem('pageContent').title("Textes de l'accueil"),
            S.documentTypeListItem('carnet').title('Carnets'),
            S.divider(),
            S.documentTypeListItem('statAge').title('Âge des visiteurs'),
        ]);
};
