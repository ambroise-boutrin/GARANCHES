"use client";

import { telHref } from "@/data/contacts";
import { useTelephones } from "@/components/Contenu";

// Liste des numéros : prénoms et numéros alignés en deux colonnes.
export default function Telephones({ className = "", lien = "" }: { className?: string; lien?: string }) {
    return (
        <dl className={`grid grid-cols-[auto_auto] gap-x-4 gap-y-1 tabular-nums ${className}`}>
            {useTelephones().map((t) => (
                <div key={t.nom} className="contents">
                    <dt>{t.nom}</dt>
                    <dd>
                        <a href={telHref(t.numero)} className={`whitespace-nowrap ${lien}`}>{t.numero}</a>
                    </dd>
                </div>
            ))}
        </dl>
    );
}
