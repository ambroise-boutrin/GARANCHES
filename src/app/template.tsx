"use client";

import { motion } from "framer-motion";
import { estNavigationDouce } from "@/lib/navigationDouce";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            // Depuis la barre d'un univers, la page s'affiche directement, sans effet de rechargement.
            initial={estNavigationDouce() ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Courbe "easeOutQuint" très douce
        >
            {children}
        </motion.div>
    );
}
