"use client";

import { useState } from "react";

const LIEN_ITINERAIRE =
    "https://www.google.com/maps/search/?api=1&query=Domaine+de+Garanches+345+chemin+de+Garanches+69460+Odenas";

// La carte Google ne se charge qu'après un clic du visiteur : avant, aucune donnée
// (adresse IP, cookies Google) n'est envoyée à Google, comme le demande la CNIL.
export default function InteractiveMap() {
    const [affichee, setAffichee] = useState(false);

    return (
        <div className="relative w-full h-[320px] md:h-[500px] bg-stone-100 overflow-hidden border-4 border-white/50">
            {affichee ? (
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44199.87878345151!2d4.661828!3d46.082958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4be5c5c5c5c5c%3A0x0!2s345%20Chemin%20de%20Garanches%2C%2069460%20Odenas!5e0!3m2!1sfr!2sfr!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full sepia-[.3] contrast-[1.1] opacity-90"
                    title="Carte du Domaine de Garanches"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <p className="text-stone-800">
                        345 chemin de Garanches, 69460 Odenas
                    </p>
                    <button
                        type="button"
                        onClick={() => setAffichee(true)}
                        className="px-5 py-3 text-sm font-medium text-white bg-wine-900 hover:bg-wine-800 transition-colors"
                    >
                        Afficher la carte
                    </button>
                    <a
                        href={LIEN_ITINERAIRE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-wine-900 underline underline-offset-2"
                    >
                        Ouvrir l'itinéraire dans Google Maps
                    </a>
                    <p className="max-w-sm text-xs text-stone-600">
                        La carte est fournie par Google, qui peut déposer des cookies et recevoir votre adresse IP une fois la carte affichée.
                    </p>
                </div>
            )}
        </div>
    );
}
