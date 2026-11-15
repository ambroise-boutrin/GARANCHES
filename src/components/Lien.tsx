"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps } from "react";
import { useLangue } from "@/components/Contenu";
import { lienLangue } from "@/lib/langue";

// Lien interne qui reste dans la langue de la page : sur la version anglaise, "/contact" mène à "/en/contact".
// À utiliser partout à la place de next/link.
const Lien = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(function Lien({ href, ...props }, ref) {
    const langue = useLangue();
    const cible = typeof href === "string" ? lienLangue(href, langue) : href.pathname ? { ...href, pathname: lienLangue(href.pathname, langue) } : href;
    return <Link ref={ref} href={cible} {...props} />;
});

export default Lien;
