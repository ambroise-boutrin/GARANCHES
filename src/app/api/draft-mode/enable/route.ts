import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/env";

// Ouvert par le mode visuel du studio : vérifie le secret donné par Sanity puis active l'aperçu des brouillons.
const { GET: activer } = defineEnableDraftMode({
    client: client.withConfig({ token: readToken }),
});

export async function GET(request: Request) {
    if (!readToken) {
        return new Response(
            "Mode visuel pas encore activé : ajoutez dans Vercel la variable SANITY_API_READ_TOKEN (jeton « Viewer » Sanity) ou SANITY_API_WRITE_TOKEN, puis redéployez.",
            { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } }
        );
    }
    return activer(request);
}
