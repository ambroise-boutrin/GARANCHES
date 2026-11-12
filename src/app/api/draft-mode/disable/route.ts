import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Quitte l'aperçu des brouillons et revient sur la page en cours.
export function GET(request: NextRequest) {
    draftMode().disable();
    const retour = request.nextUrl.searchParams.get("retour") || "/";
    return NextResponse.redirect(new URL(retour.startsWith("/") ? retour : "/", request.url));
}
