"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ConsentSettings {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consent, setConsent] = useState<ConsentSettings>({
        necessary: true,
        analytics: false,
        marketing: false,
    });

    // Load saved consent on mount
    useEffect(() => {
        const savedConsent = localStorage.getItem("cookie-consent-settings");
        if (!savedConsent) {
            setIsVisible(true);
        } else {
            setConsent(JSON.parse(savedConsent));
        }
    }, []);

    // Save consent to localStorage
    const saveConsent = (settings: ConsentSettings) => {
        localStorage.setItem("cookie-consent-settings", JSON.stringify(settings));
        localStorage.setItem("cookie-consent", "answered"); // Flag for simple checks
        setConsent(settings);
        setIsVisible(false);
        setShowSettings(false);

        // Apply consent logic here (e.g., enable/disable GA)
        if (settings.analytics) {
            console.log("Analytics cookies enabled");
            // window.gtag('consent', 'update', { ... });
        }
    };

    const handleAcceptAll = () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
    };

    const handleDeclineAll = () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
    };

    const handleSavePreferences = () => {
        saveConsent(consent);
    };

    const toggleConsent = (key: keyof ConsentSettings) => {
        if (key === "necessary") return;
        setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && !showSettings && (
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[150] bg-white border-t border-stone-300 pb-[env(safe-area-inset-bottom)]"
                    >
                        {/* Bandeau simple et compact : il ne cache pas la page sur téléphone. */}
                        <div className="max-w-6xl mx-auto px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                            <p className="flex-1 text-[13px] md:text-sm text-stone-700 leading-snug">
                                Ce site n’utilise ni publicité ni cookie de suivi : il retient seulement la vérification de votre âge et vos choix.{" "}
                                <Link href="/politique-confidentialite" className="text-wine-900 underline underline-offset-2">
                                    En savoir plus
                                </Link>
                                {" · "}
                                <button onClick={() => setShowSettings(true)} className="text-wine-900 underline underline-offset-2">
                                    Personnaliser
                                </button>
                            </p>
                            <div className="grid grid-cols-2 gap-2 md:flex md:gap-3 shrink-0">
                                <button
                                    onClick={handleDeclineAll}
                                    className="px-4 py-2.5 text-sm text-stone-800 border border-stone-400 hover:bg-stone-50 transition-colors"
                                >
                                    Refuser
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-4 py-2.5 text-sm font-medium text-white bg-wine-900 hover:bg-wine-800 transition-colors"
                                >
                                    Accepter
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            onClick={() => setShowSettings(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            className="relative w-full max-w-2xl bg-white flex flex-col max-h-[85vh] overflow-hidden"
                        >

                            <div className="p-6 border-b border-stone-100 bg-stone-50/80 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                                <div>
                                    <h3 className="normal-case tracking-normal text-xl font-serif font-bold text-stone-900">Préférences des cookies</h3>
                                    <p className="text-sm text-stone-700 mt-1">Gérez vos choix de consentement.</p>
                                </div>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
                                >
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </div>


                            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">


                                <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 border border-stone-100">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-stone-900">Nécessaires</span>
                                            <span className="text-[10px] font-bold text-wine-900 bg-wine-50 px-2 py-0.5 rounded-full border border-wine-100">Toujours actif</span>
                                        </div>
                                        <p className="text-sm text-stone-700">
                                            Indispensables au bon fonctionnement du site (vérification d'âge, sécurité).
                                        </p>
                                    </div>
                                    <Switch checked={true} disabled />
                                </div>


                                <div className="flex items-start justify-between gap-4 p-4 border border-stone-100 hover:border-stone-200 transition-colors">
                                    <div className="space-y-1">
                                        <span className="font-semibold text-stone-900 block">Analytiques</span>
                                        <p className="text-sm text-stone-700">
                                            Nous permettent de mesurer l'audience (Google Analytics, etc.). <span className="text-xs text-stone-600">Non utilisé actuellement.</span>
                                        </p>
                                    </div>
                                    <Switch
                                        checked={consent.analytics}
                                        onChange={() => toggleConsent("analytics")}
                                    />
                                </div>


                                <div className="flex items-start justify-between gap-4 p-4 border border-stone-100 hover:border-stone-200 transition-colors">
                                    <div className="space-y-1">
                                        <span className="font-semibold text-stone-900 block">Marketing</span>
                                        <p className="text-sm text-stone-700">
                                            Publicités ciblées. <span className="text-xs text-stone-600">Non utilisé actuellement.</span>
                                        </p>
                                    </div>
                                    <Switch
                                        checked={consent.marketing}
                                        onChange={() => toggleConsent("marketing")}
                                    />
                                </div>

                            </div>


                            <div className="p-6 border-t border-stone-100 bg-stone-50/80 flex justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-sm">
                                <button
                                    onClick={handleDeclineAll}
                                    className="px-5 py-2.5 text-sm font-medium text-stone-800 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
                                >
                                    Tout refuser
                                </button>
                                <button
                                    onClick={handleSavePreferences}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 transition-colors"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {!isVisible && !showSettings && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowSettings(true)}
                    className="hidden md:block fixed bottom-4 left-4 z-[140] p-3 bg-white/80 backdrop-blur border border-stone-100 rounded-full text-stone-600 hover:text-wine-900 transition-colors group"
                    title="Gérer les cookies"
                >
                    <CookieIcon className="w-5 h-5" />
                </motion.button>
            )}
        </>
    );
}

// Helper Components

function Switch({ checked, onChange, disabled }: { checked: boolean; onChange?: () => void; disabled?: boolean }) {
    return (
        <button
            onClick={onChange}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-wine-900 focus:ring-offset-2 ${checked ? "bg-wine-900" : "bg-stone-200"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <span className="sr-only">Toggle setting</span>
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    );
}

function CookieIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
        </svg>
    );
}

function CloseIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="M6 6 18 18" />
        </svg>
    );
}
