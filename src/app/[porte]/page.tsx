// Pages préparées à l'avance et remises à jour chaque minute : la navigation est instantanée
// et les textes modifiés dans Sanity apparaissent en moins d'une minute.
import { PAGES } from "@/data/architecture";
import { pageMetadata, renderPage } from "@/components/editorial/renderPage";

export const revalidate = 60;

type Props = { params: { porte: string } };

export function generateStaticParams() {
    return Object.keys(PAGES).filter((path) => !path.includes("/")).map((porte) => ({ porte }));
}

export function generateMetadata({ params }: Props) {
    return pageMetadata(params.porte);
}

export default function PortePage({ params }: Props) {
    return renderPage(params.porte);
}
