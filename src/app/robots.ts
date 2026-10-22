import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/admin/"], // Protège les dossiers techniques
        },
        sitemap: "https://domainedegaranches.com/sitemap.xml",
    };
}