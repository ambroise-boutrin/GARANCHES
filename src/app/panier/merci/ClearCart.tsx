"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

// Vide le panier une fois le paiement confirmé. Le stockage local est effacé directement
// car, au premier affichage, cet effet passe avant le chargement du panier sauvegardé.
export default function ClearCart() {
    const { clearCart } = useCart();
    useEffect(() => {
        try {
            localStorage.removeItem("garanches_cart");
        } catch {}
        clearCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}
