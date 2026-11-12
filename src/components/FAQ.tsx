"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import { useFaq, useTexte } from "@/components/Contenu";

export default function FAQ() {
    const faqs = useFaq();
    const titre = useTexte("contact.faq.titre");
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-stone-50 border-t border-stone-200 mt-20">
            <div className="max-w-4xl mx-auto px-6">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif text-wine-900">{titre}</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    aria-expanded={openIndex === index}
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

                                {/* Réponse toujours présente dans la page (lue par Google), affichée au clic. */}
                                <div hidden={openIndex !== index}>
                                    <div className="px-6 pb-6 text-gray-800 leading-relaxed border-t border-gray-50 pt-4">
                                        {faq.reponse}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
