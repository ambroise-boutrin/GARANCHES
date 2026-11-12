"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import FAQ from "@/components/FAQ";
import OpeningStatus from "@/components/OpeningStatus";
import Telephones from "@/components/Telephones";
import { Lignes, usePhoto, useTexte } from "@/components/Contenu";
import { stegaClean } from "@sanity/client/stega";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    loading: () => <div className="w-full h-[500px] bg-stone-100 animate-pulse" />,
    ssr: false
});

const SUJETS = [
    "Les tables d'hôtes",
    "Déguster au domaine",
    "Découvrir les vignes",
    "Expérience privée",
    "Événements",
    "Commande & Expédition",
    "Partenariat Professionnel",
    "Autre demande",
];

export default function ContactContent({ sujet, vin }: { sujet?: string; vin?: string }) {
    const t = useTexte;
    const EMAIL = stegaClean(t("contact.email")).trim();
    const titre = t("contact.titre");
    const intro = t("contact.intro");
    const coordonnees = t("contact.coordonnees");
    const adresse = t("contact.adresse");
    const horaires = t("contact.horaires");
    const fermeture = t("contact.fermeture");
    const photo = usePhoto("contact.photo");
    const formulaire = t("contact.formulaire");
    const venirTitre = t("contact.venir.titre");
    const venirTexte = t("contact.venir.texte");
    const boutonVin = t("cuvees.bouton");
    const [subject, setSubject] = useState(sujet && SUJETS.includes(sujet) ? sujet : SUJETS[SUJETS.length - 1]);

    // Pas de serveur d'envoi : le message s'ouvre, pré-rempli, dans la messagerie du visiteur.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const details = [
            data.get("nom"),
            data.get("telephone") && `Tél. : ${data.get("telephone")}`,
            data.get("date") && `Date souhaitée : ${data.get("date")}`,
            data.get("personnes") && `Nombre de personnes : ${data.get("personnes")}`,
        ].filter(Boolean);
        const body = `${data.get("message") || ""}\n\n${details.join("\n")}`;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const isBooking = SUJETS.slice(0, 5).includes(subject);
    // Arrivée depuis le bouton « Demander des bouteilles » d'une cuvée.
    const vinDemande = vin?.slice(0, 80);
    const messageInitial = vinDemande
        ? `Bonjour,\n\nJe souhaiterais prendre des bouteilles de ${vinDemande}.\nNombre de bouteilles : \nRetrait au domaine ou livraison (adresse) : \n\nMerci !`
        : undefined;

    return (
        <main className="min-h-screen bg-paper pt-32 pb-20">
            <FadeIn direction="down" className="text-center px-6 mb-16">
                <h1 className="text-4xl md:text-5xl font-serif text-wine-900 mb-6 font-medium">{titre}</h1>
                <p className="max-w-xl mx-auto text-gray-800 text-lg">
                    {intro}
                </p>
            </FadeIn>

            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
                <FadeIn direction="right" delay={0.2}>
                    <div className="bg-white p-10 border border-gray-100 relative overflow-hidden group">
                        <h2 className="text-3xl font-serif text-wine-900 mb-10 relative z-10">{coordonnees}</h2>

                        <div className="space-y-10 relative z-10">
                            <div className="flex gap-4">
                                <div className="w-6 shrink-0 pt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-wine-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-red-900 text-sm font-bold block mb-1">Adresse</span>
                                    <p className="text-gray-700 leading-relaxed font-medium">
                                        <Lignes texte={adresse} />
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-6 shrink-0 pt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-wine-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-red-900 text-sm font-bold block mb-1">Téléphone</span>
                                    <Telephones className="w-fit text-gray-800 leading-relaxed" lien="font-medium text-gray-900 hover:text-wine-700 transition-colors" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-6 shrink-0 pt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-wine-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-red-900 text-sm font-bold block mb-1">Horaires d'ouverture</span>
                                    <p className="text-gray-700 leading-relaxed">
                                        <Lignes texte={horaires} /><br />
                                        <span className="text-sm text-gray-700">{fermeture}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 h-48 w-full relative overflow-hidden group-hover:shadow-lg transition-all" data-sanity={photo.cliquer}>
                                <Image
                                    src={photo.src}
                                    fill
                                    sizes="(min-width: 768px) 45vw, 100vw"
                                    style={{ objectPosition: photo.position }}
                                    alt="Le domaine de Garanches au milieu de ses vignes, à Odenas"
                                    className="object-cover opacity-90"
                                />
                            </div>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn direction="left" delay={0.4}>
                    <div id="formulaire" className="scroll-mt-28 bg-stone-50 p-6 md:p-10 border border-stone-200">
                        <h2 className="text-3xl font-serif text-wine-900 mb-8">{isBooking ? "Réserver" : vinDemande ? boutonVin : formulaire}</h2>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2 font-bold ml-2">Nom</label>
                                    <input type="text" name="nom" required className="w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all" placeholder="Votre nom" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2 font-bold ml-2">Email</label>
                                    <input type="email" name="email" className="w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all" placeholder="votre@email.com" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-2 font-bold ml-2">Sujet</label>
                                <div className="relative">
                                    <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all text-gray-700 appearance-none cursor-pointer">
                                        {SUJETS.map((s) => (
                                            <option key={s}>{s}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {isBooking && (
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2 font-bold ml-2">Date souhaitée</label>
                                        <input type="date" name="date" className="w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2 font-bold ml-2">Personnes</label>
                                        <input type="number" name="personnes" min={1} max={30} className="w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2 font-bold ml-2">Téléphone</label>
                                        <input type="tel" name="telephone" className="w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-700 mb-2 font-bold ml-2">Message</label>
                                <textarea name="message" rows={vinDemande ? 8 : 5} defaultValue={messageInitial} className="w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-wine-900 text-white py-4 text-base font-medium hover:bg-wine-800 transition-colors">
                                {isBooking ? "Envoyer ma demande" : "Envoyer le message"}
                            </button>

                            <p className="text-xs text-gray-600 text-center mt-4">
                                Votre messagerie s'ouvre avec le message prêt à envoyer à {EMAIL}.
                            </p>
                        </form>
                    </div>
                </FadeIn>
            </div>

            <section className="max-w-6xl mx-auto px-6 mt-24 grid md:grid-cols-2 gap-12 items-center">
                <FadeIn direction="right">
                    <h2 className="text-3xl md:text-4xl font-serif text-wine-900 mb-6">{venirTitre}</h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        {venirTexte}
                    </p>
                    <OpeningStatus />
                </FadeIn>
                <FadeIn direction="left" delay={0.2}>
                    <InteractiveMap />
                </FadeIn>
            </section>

            <FAQ />
        </main >
    );
}
