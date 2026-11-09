"use client";

import { useState, useEffect } from "react";

const OpeningStatus = ({ compact = false, className = "" }: { compact?: boolean; className?: string }) => {
    const [status, setStatus] = useState<{ isOpen: boolean; text: string } | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            const now = new Date();
            const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
            const hour = now.getHours();

            // Horaires : Lundi (1) au Samedi (6), de 9h à 18h
            // Pause déjeuner ? (Souvent 12h-14h) -> On simplifie 9-18h pour le moment
            const isOpenDay = day >= 1 && day <= 6;
            const isOpenHour = hour >= 9 && hour < 18;

            if (isOpenDay && isOpenHour) {
                setStatus({ isOpen: true, text: "Ouvert actuellement" });
            } else {
                let nextOpenText = "";
                if (!isOpenDay) {
                    // Si on est Dimanche -> Ouvre Lundi 9h
                    nextOpenText = "Ouvre Lun. 9h";
                } else if (hour < 9) {
                    // Si on est le matin avant 9h -> Ouvre à 9h
                    nextOpenText = "Ouvre à 9h";
                } else {
                    // Si on est le soir après 18h -> Ouvre demain 9h
                    // (Sauf si demain est dimanche)
                    nextOpenText = day === 6 ? "Ouvre Lun. 9h" : "Ouvre Demain 9h";
                }

                // En mode compact, on affiche juste "Fermé".
                // En mode normal, on affiche "Fermé • Ouvre..."
                const finalText = compact ? "Fermé" : `Fermé • ${nextOpenText}`;

                setStatus({ isOpen: false, text: finalText });
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 60000); // Mise à jour chaque minute
        return () => clearInterval(interval);
    }, [compact]);

    if (!status) return null; // Rien côté serveur pour éviter mismatch

    return (
        <div className={`inline-flex items-center gap-2 ${className}`} title={status.text}>
            <span className="relative flex h-2.5 w-2.5">
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.isOpen ? "bg-green-500" : "bg-red-500"}`}></span>
            </span>
            <span className={`text-[10px] md:text-xs uppercase tracking-widest font-bold whitespace-nowrap ${status.isOpen ? "text-green-700" : "text-red-700"}`}>
                {status.text}
            </span>
        </div>
    );
};

export default OpeningStatus;
