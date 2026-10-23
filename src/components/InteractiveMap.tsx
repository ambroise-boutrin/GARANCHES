"use client";

export default function InteractiveMap() {
    return (
        <div className="relative w-full h-[320px] md:h-[500px] bg-stone-100 rounded-lg overflow-hidden shadow-lg border-4 border-white/50 group">

            {/* Carte Google Maps avec filtre 'Chaleureux' (Sépia léger) pour s'intégrer au site */}
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44199.87878345151!2d4.661828!3d46.082958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4be5c5c5c5c5c%3A0x0!2s345%20Chemin%20de%20Garanches%2C%2069460%20Odenas!5e0!3m2!1sfr!2sfr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full sepia-[.3] contrast-[1.1] opacity-90 transition-all duration-700 hover:sepia-0 hover:opacity-100 hover:contrast-100"
                title="Carte du Domaine de Garanches"
            />

            {/* Un simple bouton discret et élégant en bas à droite si besoin, ou rien du tout pour la pureté */}

        </div>
    );
}
