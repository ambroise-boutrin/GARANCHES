"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import FAQ from "@/components/FAQ";
import OpeningStatus from "@/components/OpeningStatus";
import Telephones from "@/components/Telephones";
import { Lignes, usePhoto, useTexte, useUi } from "@/components/Contenu";
import { stegaClean } from "@sanity/client/stega";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
    loading: () => <div className="w-full h-[500px] bg-stone-100 animate-pulse" />,
    ssr: false
});

// Valeurs reçues dans l'adresse (?sujet=…) : toujours en français. Le visiteur voit leur traduction (src/i18n/ui.ts).
const CLE_ENVOI = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

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
    const ui = useUi();
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
    const delai = t("contact.delai");
    const allerFormulaire = t("contact.aller-formulaire");
    const [subject, setSubject] = useState(sujet && SUJETS.includes(sujet) ? sujet : SUJETS[SUJETS.length - 1]);
    const [copie, setCopie] = useState(false);
    const copierAdresse = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopie(true);
            setTimeout(() => setCopie(false), 2500);
        } catch { }
    };

    // Envoi direct par Web3Forms (clé NEXT_PUBLIC_WEB3FORMS_KEY dans Vercel). Sans clé, ou si l'envoi échoue,
    // le message s'ouvre, pré-rempli, dans la messagerie du visiteur.
    const [etat, setEtat] = useState<"pret" | "envoi" | "envoye" | "erreur">("pret");
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formulaireHtml = event.currentTarget;
        const data = new FormData(formulaireHtml);
        if (data.get("botcheck")) return;
        const details = [
            data.get("nom"),
            data.get("societe") && `${ui.mailSociete} ${data.get("societe")}`,
            data.get("telephone") && `${ui.mailTel} ${data.get("telephone")}`,
            data.get("date") && `${ui.mailDate} ${data.get("date")}`,
            data.get("personnes") && `${ui.mailPersonnes} ${data.get("personnes")}`,
        ].filter(Boolean);
        const body = `${data.get("message") || ""}\n\n${details.join("\n")}`;
        // Objet du message : le sujet tel que le visiteur l'a lu (en anglais sur la version anglaise).
        const objet = ui.sujets[subject] ?? subject;
        const ouvrirMessagerie = () => {
            window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(body)}`;
        };
        if (!CLE_ENVOI) return ouvrirMessagerie();
        setEtat("envoi");
        try {
            const reponse = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    access_key: CLE_ENVOI,
                    subject: `Site Garanches : ${objet}`,
                    from_name: String(data.get("nom") || "Site Garanches"),
                    email: data.get("email"),
                    replyto: data.get("email"),
                    message: body,
                }),
            });
            const resultat = await reponse.json().catch(() => ({}));
            if (!reponse.ok || !resultat.success) throw new Error("envoi");
            setEtat("envoye");
            formulaireHtml.reset();
        } catch {
            setEtat("erreur");
        }
    };

    const isBooking = SUJETS.slice(0, 5).includes(subject);
    // Date et nombre de personnes : réservations, et professionnels (agences, groupes).
    const avecDate = isBooking || subject === "Partenariat Professionnel";
    const champ = "w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all";
    const etiquette = "block text-sm text-gray-700 mb-2 font-bold ml-2";
    // Arrivée depuis le bouton « Demander des bouteilles » d'une cuvée.
    const vinDemande = vin?.slice(0, 80);
    const messageInitial = vinDemande
        ? ui.messageVin(vinDemande)
        : sujet === "Commande & Expédition"
            ? ui.messageCommande
            : undefined;

    return (
        <main className="min-h-screen bg-paper pt-32 pb-20">
            <FadeIn direction="down" className="text-center px-6 mb-16">
                <h1 className="text-4xl md:text-5xl font-serif text-wine-900 mb-6 font-medium">{titre}</h1>
                <p className="max-w-xl mx-auto text-gray-800 text-lg">
                    {intro}
                </p>
                <a href="#formulaire" className="inline-block mt-6 text-base text-red-900 underline underline-offset-4 decoration-1">{allerFormulaire}</a>
            </FadeIn>

            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
                <FadeIn direction="right" delay={0.2} className="min-w-0">
                    <div className="bg-white p-6 md:p-10 border border-gray-100 relative overflow-hidden group">
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
                                    <span className="text-red-900 text-sm font-bold block mb-1">{ui.adresse}</span>
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
                                    <span className="text-red-900 text-sm font-bold block mb-1">{ui.telephone}</span>
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
                                    <span className="text-red-900 text-sm font-bold block mb-1">{ui.horaires}</span>
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
                                    alt={ui.altContact}
                                    className="object-cover opacity-90"
                                />
                            </div>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn direction="left" delay={0.4} className="min-w-0">
                    <div id="formulaire" className="scroll-mt-28 bg-stone-50 p-6 md:p-10 border border-stone-200">
                        <h2 className="text-3xl font-serif text-wine-900 mb-8">{isBooking ? ui.reserver : vinDemande ? boutonVin : formulaire}</h2>

                        <form key={`${sujet}-${vin}`} className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="f-nom" className={etiquette}>{ui.nom}</label>
                                    <input id="f-nom" type="text" name="nom" required autoComplete="name" className={champ} placeholder={ui.votreNom} />
                                </div>
                                <div>
                                    <label htmlFor="f-email" className={etiquette}>{ui.email}</label>
                                    <input id="f-email" type="email" name="email" required autoComplete="email" className={champ} placeholder={ui.votreEmail} />
                                </div>
                                <div>
                                    <label htmlFor="f-telephone" className={etiquette}>{ui.telephoneFacultatif}</label>
                                    <input id="f-telephone" type="tel" name="telephone" autoComplete="tel" className={champ} />
                                </div>
                                <div>
                                    <label htmlFor="f-societe" className={etiquette}>{ui.societe}</label>
                                    <input id="f-societe" type="text" name="societe" autoComplete="organization" className={champ} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="f-sujet" className={etiquette}>{ui.sujet}</label>
                                <div className="relative">
                                    <select id="f-sujet" value={subject} onChange={(e) => setSubject(e.target.value)} className={`${champ} text-gray-700 appearance-none cursor-pointer`}>
                                        {SUJETS.map((s) => (
                                            <option key={s} value={s}>{ui.sujets[s] ?? s}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {avecDate && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="f-date" className={etiquette}>{ui.dateSouhaitee}</label>
                                        <input id="f-date" type="date" name="date" className={`block min-w-0 ${champ}`} />
                                    </div>
                                    <div>
                                        <label htmlFor="f-personnes" className={etiquette}>{ui.personnes}</label>
                                        <input id="f-personnes" type="number" name="personnes" min={1} inputMode="numeric" className={champ} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="f-message" className={etiquette}>{ui.message}</label>
                                <textarea id="f-message" name="message" rows={vinDemande ? 8 : 5} defaultValue={messageInitial} className="w-full bg-white border border-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-wine-100 focus:border-wine-300 transition-all resize-none" placeholder={ui.commentAider}></textarea>
                            </div>

                            {/* Champ piège invisible : les robots le remplissent, pas les visiteurs. */}
                            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                            <button type="submit" disabled={etat === "envoi"} className="w-full bg-wine-900 text-white py-4 text-base font-medium hover:bg-wine-800 transition-colors disabled:opacity-70">
                                {etat === "envoi" ? ui.envoiEnCours : isBooking ? ui.envoyerDemande : ui.envoyerMessage}
                            </button>

                            {etat === "envoye" && (
                                <p role="status" className="bg-white border border-green-700 text-green-800 p-4 text-center">{ui.messageEnvoye}</p>
                            )}
                            {etat === "erreur" && (
                                <p role="alert" className="bg-white border border-red-800 text-red-900 p-4 text-center">{ui.envoiEchoue}</p>
                            )}

                            <p className="text-sm text-gray-700 text-center mt-4">
                                {CLE_ENVOI ? null : <>{ui.messagerieOuvre} <span className="break-all">{EMAIL}</span>. </>}{delai}
                            </p>
                            {(!CLE_ENVOI || etat === "erreur") && <div className="text-sm text-gray-700 text-center">
                                {CLE_ENVOI ? ui.ecrireDirectement : ui.pasDeMessagerie}{" "}
                                <a href={`mailto:${EMAIL}`} className="block whitespace-nowrap underline underline-offset-4 decoration-1 text-red-900">{EMAIL}</a>
                                <button type="button" onClick={copierAdresse} className="block mx-auto mt-2 min-h-11 px-4 border border-stone-300 text-gray-800 hover:border-wine-700 transition-colors" aria-live="polite">
                                    {copie ? ui.adresseCopiee : ui.copierAdresse}
                                </button>
                            </div>}
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
