"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/FadeIn";

const faqs = [
    {
        question: "Où se situe le Domaine de Garanches ?",
        answer: "Le Domaine de Garanches est situé au 345 chemin de Garanches à Odenas (69460), au pied du Mont Brouilly, en plein cœur du Beaujolais."
    },
    {
        question: "Quels types de vins produisez-vous ?",
        answer: "Nous produisons principalement des vins rouges en appellation Brouilly (Gamay), ainsi que du Bourgogne Blanc (Chardonnay) et une méthode traditionnelle brut."
    },
    {
        question: "Proposez-vous des visites et dégustations ?",
        answer: "Oui, nous accueillons les visiteurs pour des dégustations et des visites du domaine sur rendez-vous, du lundi au samedi. N'hésitez pas à nous contacter avant votre venue."
    },
    {
        question: "Puis-je commander vos vins en ligne ?",
        answer: "Tout à fait. Notre boutique en ligne vous permet de commander nos cuvées avec paiement sécurisé. Nous assurons l'expédition dans toute la France dans des emballages protégés."
    },
    {
        question: "Acceptez-vous les groupes ?",
        answer: "Oui, nous pouvons accueillir des groupes pour des dégustations commentées. Merci de nous contacter via le formulaire pour organiser votre venue."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-stone-50 border-t border-stone-200 mt-20">
            <div className="max-w-4xl mx-auto px-6">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <span className="text-red-900 uppercase tracking-[0.3em] text-xs font-bold mb-3 block">Questions Fréquentes</span>
                        <h2 className="text-4xl font-serif text-wine-900">Tout savoir sur le Domaine</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-gray-50 transition-colors"
                                >
                                    <span className={`font-serif text-xl ${openIndex === index ? "text-wine-900" : "text-gray-800"}`}>
                                        {faq.question}
                                    </span>
                                    <span className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-45" : "rotate-0"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 text-gray-600 leading-relaxed font-light border-t border-gray-50 pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
