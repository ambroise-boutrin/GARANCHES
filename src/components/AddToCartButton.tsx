"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

type Wine = {
    id: string;
    name: string;
    price: number;
    image: string;
    subtitle?: string;
    description?: string;
    tags?: string[];
};

import { motion, AnimatePresence } from "framer-motion";

export default function AddToCartButton({ wine }: { wine: Wine }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            id: wine.id,
            name: wine.name,
            price: wine.price,
            image: wine.image,
            quantity: quantity
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const increment = () => setQuantity(q => q + 1);
    const decrement = () => setQuantity(q => q > 1 ? q - 1 : 1);

    return (
        <div className="flex flex-row items-center justify-between md:justify-start gap-3 md:gap-4 mt-6 w-full">


            <div className="flex items-center border border-wine-900 w-fit overflow-hidden shrink-0 bg-white">
                <button
                    onClick={decrement}
                    aria-label="Réduire la quantité"
                    className="px-3 md:px-4 py-3 text-wine-900 hover:bg-wine-50 transition-colors"
                >
                    -
                </button>
                <span className="px-1 py-3 min-w-[2.5rem] text-center text-wine-900 font-bold">
                    {quantity}
                </span>
                <button
                    onClick={increment}
                    aria-label="Augmenter la quantité"
                    className="px-3 md:px-4 py-3 text-wine-900 hover:bg-wine-50 transition-colors"
                >
                    +
                </button>
            </div>


            <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className={`
                    relative overflow-hidden flex-1 md:flex-none px-4 md:px-8 py-3 whitespace-nowrap
                    text-xs uppercase tracking-widest font-bold 
                    transition-colors duration-300 border border-wine-900
                    bg-wine-900 text-white hover:bg-white hover:text-wine-900
                `}
            >
                <AnimatePresence mode="wait">
                    {isAdded ? (
                        <motion.span
                            key="added"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            Ajouté
                        </motion.span>
                    ) : (
                        <motion.span
                            key="add"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            Ajouter au panier
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
