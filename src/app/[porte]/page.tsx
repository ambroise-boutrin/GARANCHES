// Rendu à la demande, comme le reste du site : les textes modifiés dans Sanity apparaissent aussitôt.
import { pageMetadata, renderPage } from "@/components/editorial/renderPage";

type Props = { params: { porte: string } };

export function generateMetadata({ params }: Props) {
    return pageMetadata(params.porte);
}

export default function PortePage({ params }: Props) {
    return renderPage(params.porte);
}
