// Rendu à la demande, comme le reste du site : les textes modifiés dans Sanity apparaissent aussitôt.
import { pageMetadata, renderPage } from "@/components/editorial/renderPage";

type Props = { params: { porte: string; page: string } };

export function generateMetadata({ params }: Props) {
    return pageMetadata(`${params.porte}/${params.page}`);
}

export default function SousPage({ params }: Props) {
    return renderPage(`${params.porte}/${params.page}`);
}
