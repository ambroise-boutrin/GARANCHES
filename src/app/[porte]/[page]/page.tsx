// Pages préparées à l'avance et remises à jour chaque minute : la navigation est instantanée
// et les textes modifiés dans Sanity apparaissent en moins d'une minute.
import { PAGES } from "@/data/architecture";
import { pageMetadata, renderPage } from "@/components/editorial/renderPage";

export const revalidate = 60;

type Props = { params: { porte: string; page: string } };

export function generateStaticParams() {
    return Object.keys(PAGES)
        .filter((path) => path.split("/").length === 2)
        .map((path) => {
            const [porte, page] = path.split("/");
            return { porte, page };
        });
}

export function generateMetadata({ params }: Props) {
    return pageMetadata(`${params.porte}/${params.page}`);
}

export default function SousPage({ params }: Props) {
    return renderPage(`${params.porte}/${params.page}`);
}
